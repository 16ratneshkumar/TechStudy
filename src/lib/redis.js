import { Redis } from '@upstash/redis';

// Use the standard KV environment variables provided by Vercel KV or Upstash Redis
// Fallback to null if not present so it doesn't crash builds without env vars
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Custom Requester with 1.5s timeout to prevent hanging sockets
class TimeoutRequester {
    async request(options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        try {
            const response = await fetch(options.url, {
                method: options.method || 'POST',
                headers: options.headers || {},
                body: options.body,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
}

export const redis = url && token
    ? new Redis({
        url,
        token,
        options: {
            requester: new TimeoutRequester()
        }
    })
    : null;
