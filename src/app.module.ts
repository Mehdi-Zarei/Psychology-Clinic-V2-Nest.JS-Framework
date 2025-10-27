import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./config/typeorm.config";
import { JwtModule } from "@nestjs/jwt";
import { SmsModule } from "./sms/sms.module";
import { RedisModule } from "./redis/redis.module";
import { AvailableTimeModule } from "./available-time/available-time.module";
import { PsychologistModule } from "./psychologist/psychologist.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    SmsModule,
    RedisModule,
    JwtModule,
    AvailableTimeModule,
    PsychologistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
