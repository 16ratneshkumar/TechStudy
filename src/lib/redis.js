import { Redis } from '@upstash/redis';

// Use the standard KV environment variables provided by Vercel KV or Upstash Redis
// Fallback to null if not present so it doesn't crash builds without env vars
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
