import Redis from 'ioredis';

let redis: Redis | null = null;

export const getRedisClient = () => {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      enableOfflineQueue: true,
      retryStrategy: (times) => Math.min(100 + times * 2, 2000),
      maxRetriesPerRequest: 3,
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    redis.on('connect', () => {
      console.log('Connected to Redis');
    });
  }
  return redis;
};

export const closeRedisConnection = async () => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};

export interface CacheConfig {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 300 // Default 5 minutes
): Promise<T> => {
  const redis = getRedisClient();
  const cachedValue = await redis.get(key);

  if (cachedValue) {
    try {
      return JSON.parse(cachedValue);
    } catch (error) {
      console.error('Error parsing cached value:', error);
    }
  }

  const value = await fn();
  await redis.setex(key, ttl, JSON.stringify(value));
  return value;
};
