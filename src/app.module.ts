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
import { BookingModule } from "./booking/booking.module";
import { ReviewModule } from "./review/review.module";
import { ArticleModule } from "./article/article.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TaskModule } from "./tasks/tasks.module";

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
    BookingModule,
    ReviewModule,
    ArticleModule,
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
