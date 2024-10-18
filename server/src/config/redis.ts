import { createClient } from "redis";

export const createRedisConnection = async () => {
  try {
    const client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
    return client;
  } catch (error) {
    console.error("Redis Connection Error :: ", error);
  }
};
