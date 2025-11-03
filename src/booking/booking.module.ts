import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingEntity } from "./entities/booking.entity";
import { AvailableTimeEntity } from "src/available-time/entities/available-time.entity";
import { UserModule } from "src/user/user.module";
import { JwtService } from "@nestjs/jwt";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      AvailableTimeEntity,
      PsychologistEntity,
    ]),
    UserModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, JwtService],
})
export class BookingModule {}
