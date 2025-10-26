import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_CLIENT")
    private readonly redisClient: Redis,
  ) {}

  async setKey(key: string, value: string | number, ttl: number) {
    await this.redisClient.set(key, value, "EX", ttl);
  }

  async getKey(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async removeKey(key: string) {
    return await this.redisClient.del(key);
  }
}
