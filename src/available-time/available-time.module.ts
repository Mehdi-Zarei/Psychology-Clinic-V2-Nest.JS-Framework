import { Module } from "@nestjs/common";
import { AvailableTimeService } from "./available-time.service";
import { AvailableTimeController } from "./available-time.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AvailableTimeEntity } from "./entities/available-time.entity";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import { BookingEntity } from "src/booking/entities/booking.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AvailableTimeEntity,
      PsychologistEntity,
      BookingEntity,
    ]),
    UserModule,
  ],
  controllers: [AvailableTimeController],
  providers: [AvailableTimeService, JwtService],
})
export class AvailableTimeModule {}
