import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./config/typeorm.config";
import { JwtModule } from "@nestjs/jwt";
import { SmsModule } from "./sms/sms.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    SmsModule,
    RedisModule,
    JwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
