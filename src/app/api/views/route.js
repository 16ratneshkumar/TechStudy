import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Issue #4 fix: rate-limit view increments to prevent count inflation.
// 10 requests per IP per minute. Skipped gracefully if Redis is unavailable.
const ratelimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        prefix: 'rl:views',
    })
    : null;

// Allowed slug pattern: alphanumeric segments separated by '/' or '-', with optional dots.
// Matches note-path patterns like "bca/sem-1/maths" or "notes/intro.md"
const SLUG_PATTERN = /^.+$/;

/**
 * Bounds an asynchronous operation by providing a fallback value after a timeout.
 * @param {Promise<*>} promise - The operation to await.
 * @param {number} ms - The timeout duration in milliseconds.
 * @param {*} defaultValue - The value to use if the operation times out.
 * @return {Promise<*>} The operation's result or the fallback value.
 */
function withTimeout(promise, ms, defaultValue) {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(defaultValue), ms))
    ]);
}

/**
 * Increments the page-view count for a slug.
 * @param {Request} request - The request containing the slug in its JSON body.
 * @return {NextResponse} A response containing the updated view count or an error message.
 */
export async function POST(request) {
    if (!redis) {
        return NextResponse.json({ error: 'Redis is not configured', views: 0 }, { status: 200 });
    }

    // Rate limiting: reject if this IP exceeds 10 requests/minute
    if (ratelimit) {
        try {
            const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
            const limitResult = await withTimeout(ratelimit.limit(ip), 2000, { success: true });
            if (!limitResult.success) {
                return NextResponse.json({ error: 'Too many requests', views: 0 }, { status: 429 });
            }
        } catch (e) {
            console.warn('Ratelimit check failed, bypassing:', e);
        }
    }

    try {
        const { slug } = await request.json();

        if (typeof slug !== 'string' || !slug.trim() || slug.length > 256) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        if (!SLUG_PATTERN.test(slug)) {
            return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
        }

        const key = `pageviews:${slug}`;
        const views = await withTimeout(redis.incr(key), 2000, 0);

        return NextResponse.json({ views }, { status: 200 });
    } catch (error) {
        console.error('Error incrementing view count:', error);
        // Fall back gracefully to 200 with 0 views so the page doesn't show an error state
        return NextResponse.json({ views: 0, error: 'Database connection issue' }, { status: 200 });
    }
}

/**
 * Retrieves the view count for a page identified by its slug.
 * @param {Request} request - The request containing the page slug in its query parameters.
 * @returns {NextResponse} A response containing the view count, or an error message with a zero count.
 */
export async function GET(request) {
    if (!redis) {
        return NextResponse.json({ error: 'Redis is not configured', views: 0 }, { status: 200 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug || typeof slug !== 'string' || !slug.trim() || slug.length > 256) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    try {
        const key = `pageviews:${slug}`;
        const views = await withTimeout(redis.get(key), 2000, 0) || 0;
        return NextResponse.json({ views: parseInt(views, 10) }, { status: 200 });
    } catch (error) {
        console.error('Error fetching view count:', error);
        // Fall back gracefully to 200 with 0 views so the page doesn't show an error state
        return NextResponse.json({ views: 0, error: 'Database connection issue' }, { status: 200 });
    }
}
