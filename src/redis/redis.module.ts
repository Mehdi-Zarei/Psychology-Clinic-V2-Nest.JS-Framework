import { Module, Global } from "@nestjs/common";
import Redis from "ioredis";
import { RedisService } from "./redis.service";

const redisProvider = {
  provide: "REDIS_CLIENT",
  useFactory: () => {
    const redisUri = process.env.REDIS_URI || "redis://localhost:6379";
    console.log("🔗 Redis URI:", redisUri);
    const client = new Redis(redisUri);

    client.on("error", (error) => {
      console.error("❌ Redis error event:", error);
    });

    client
      .ping()
      .then(() => console.log("✅ Connected to Redis Successfully."))
      .catch((err) => console.error("❌ Redis ping failed:", err));

    return client;
  },
};

@Global()
@Module({
  providers: [redisProvider, RedisService],
  exports: [redisProvider],
})
export class RedisModule {}
