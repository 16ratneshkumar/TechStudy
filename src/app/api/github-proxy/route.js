import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

const CACHE_TTL_SECONDS = 18000;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pathValue = searchParams.get('path');
    const raw = searchParams.get('raw') === '1';

    if (!pathValue || !pathValue.startsWith('/repos/')) {
        return NextResponse.json({ error: 'Invalid or missing path' }, { status: 400 });
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
                const message = await githubResponse.text().catch(() => 'GitHub raw fetch failed');
                return NextResponse.json({ error: message }, { status: githubResponse.status });
            }
            const errorData = await githubResponse.json().catch(() => ({}));
            return NextResponse.json(errorData, { status: githubResponse.status });
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
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
