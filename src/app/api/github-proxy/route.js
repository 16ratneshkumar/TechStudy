import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { NextResponse } from 'next/server';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

// Issue #5 fix: rate-limit proxy requests to protect the GitHub API quota.
// 30 requests per IP per minute — enough for real navigation, blocks abusers.
const ratelimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '1 m'),
        prefix: 'rl:proxy',
    })
    : null;

const CACHE_TTL_SECONDS = 18000;
const MAX_PATH_LENGTH = 500;

// Allowlist: each path segment may only contain these characters.
// Covers owner/repo names, branch names, file paths, and percent-encoded chars.
const SAFE_SEGMENT_RE = /^[a-zA-Z0-9._\-@%+]+$/;

/**
 * Validates that `rawPath` is a safe GitHub API path.
 * Blocks SSRF via path traversal (e.g. /repos/../../user)
 * and URL-encoded variants (e.g. %2e%2e).
 * Also enforces a max length to prevent cache key bloat.
 */
function isSafeGithubPath(rawPath) {
    if (!rawPath || typeof rawPath !== 'string') return false;

    // Issue #2 fix: max length cap also prevents Redis key bloat
    if (rawPath.length > MAX_PATH_LENGTH) return false;

    // Split path from query string before checking segments
    const [pathPart] = rawPath.split('?');

    // Block literal and URL-encoded traversal sequences early
    const lower = rawPath.toLowerCase();
    if (lower.includes('..') || lower.includes('%2e%2e') || lower.includes('%2f%2f')) return false;

    // Must start exactly with /repos/
    if (!pathPart.startsWith('/repos/')) return false;

    // Validate every segment individually
    const segments = pathPart.split('/').filter(Boolean);

    // Minimum required: ['repos', '{owner}', '{repo}']
    if (segments.length < 3) return false;

    for (const seg of segments) {
        // Block traversal segments even without encoding
        if (seg === '..' || seg === '.') return false;
        // Strict character allowlist per segment
        if (!SAFE_SEGMENT_RE.test(seg)) return false;
    }

    return true;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pathValue = searchParams.get('path');
    const raw = searchParams.get('raw') === '1';

    // Issue #1 fix: strict SSRF-safe path validation replaces weak startsWith check
    if (!isSafeGithubPath(pathValue)) {
        return NextResponse.json({ error: 'Invalid or missing path' }, { status: 400 });
    }

    // Issue #5 fix: rate-limit per IP to protect GitHub API quota
    if (ratelimit) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
        const { success } = await ratelimit.limit(ip);
        if (!success) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const cacheKey = raw ? `github:raw:${pathValue}` : `github:json:${pathValue}`;

    try {
        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                if (raw) {
                    const buffer = Buffer.from(cached.base64, 'base64');
                    return new NextResponse(buffer, {
                        headers: { 'Content-Type': cached.contentType || 'application/octet-stream' }
                    });
                }
                return NextResponse.json(cached);
            }
        }

        const githubResponse = await fetch(`https://api.github.com${pathValue}`, {
            headers: {
                'Accept': raw ? 'application/vnd.github.raw' : 'application/vnd.github.v3+json',
                ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` }),
                'User-Agent': 'TechStudy-App/1.0',
            },
            next: { revalidate: CACHE_TTL_SECONDS }
        });

        if (!githubResponse.ok) {
            if (raw) {
                // Finding C fix: don't forward raw GitHub error body — extract only message
                const message = await githubResponse.text().catch(() => 'GitHub raw fetch failed');
                const safe = message.length < 200 ? message : 'GitHub API error';
                return NextResponse.json({ error: safe }, { status: githubResponse.status });
            }
            const errorData = await githubResponse.json().catch(() => ({}));
            // Finding C fix: forward only the message field, not the full error object
            return NextResponse.json(
                { error: errorData.message || 'GitHub API error' },
                { status: githubResponse.status }
            );
        }

        if (raw) {
            const contentType = githubResponse.headers.get('content-type') || 'application/octet-stream';
            const arrayBuffer = await githubResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            if (redis) {
                const payload = {
                    base64: buffer.toString('base64'),
                    contentType,
                };
                await redis.set(cacheKey, payload, { ex: CACHE_TTL_SECONDS });
            }

            return new NextResponse(buffer, {
                headers: { 'Content-Type': contentType }
            });
        }

        const data = await githubResponse.json();

        if (redis) {
            await redis.set(cacheKey, data, { ex: CACHE_TTL_SECONDS });
        }

        return NextResponse.json(data);
    } catch (error) {
        // Issue #3 fix: log internally, never expose error.message to client
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
