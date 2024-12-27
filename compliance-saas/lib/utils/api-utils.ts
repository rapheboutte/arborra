import { getRedisClient, CacheConfig } from '@/lib/cache/redis';
import { ApiResponse } from '@/types/compliance';

export async function withCache<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const redis = getRedisClient();

  try {
    // Try to get from cache
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // If not in cache, fetch data
    const data = await fetchFn();

    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Cache operation failed:', error);
    // If cache fails, just fetch the data
    return fetchFn();
  }
}

export function createApiResponse<T>(
  data: T,
  error?: string,
  meta?: { total: number; page: number }
): ApiResponse<T> {
  return {
    data,
    error,
    meta,
  };
}

export async function rateLimit(
  key: string,
  limit: number,
  window: number
): Promise<boolean> {
  const redis = getRedisClient();
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, window);
  }
  
  return current <= limit;
}

export function sanitizeApiKey(apiKey: string): string {
  return apiKey.replace(/[^a-zA-Z0-9-]/g, '');
}

export function generateCacheKey(
  prefix: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join(':');
  
  return `${prefix}:${sortedParams}`;
}
