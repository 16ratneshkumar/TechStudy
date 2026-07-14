import { Redis } from '@upstash/redis';

// Use the standard KV environment variables provided by Vercel KV or Upstash Redis
// Fallback to null if not present so it doesn't crash builds without env vars
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a custom fetch wrapper with a 1.5s timeout to prevent hanging sockets
const timeoutFetch = (url, init) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);
    return fetch(url, {
        ...init,
        signal: controller.signal
    }).finally(() => clearTimeout(id));
};

export const redis = url && token 
    ? new Redis({ 
        url, 
        token,
        fetch: timeoutFetch
      }) 
    : null;
