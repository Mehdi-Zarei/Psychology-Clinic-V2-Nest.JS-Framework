import { Module } from "@nestjs/common";
import { TaskService } from "./tasks.service";
import { ChangeBookingStatus } from "./jobs/change-booking-status.job";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingEntity } from "src/booking/entities/booking.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  providers: [TaskService, ChangeBookingStatus],
})
export class TaskModule {}
