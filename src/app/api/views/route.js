import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

// Allowed slug pattern: alphanumeric segments separated by '/' or '-', with optional dots.
// Matches note-path patterns like "bca/sem-1/maths" or "notes/intro.md"
const SLUG_PATTERN = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?(\/[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?)*$/;

export async function POST(request) {
    if (!redis) {
        return NextResponse.json({ error: 'Redis is not configured', views: 0 }, { status: 500 });
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
        const views = await redis.incr(key);

        return NextResponse.json({ views }, { status: 200 });
    } catch (error) {
        console.error('Error incrementing view count:', error);
        return NextResponse.json({ error: 'Internal server error', views: 0 }, { status: 500 });
    }
}
