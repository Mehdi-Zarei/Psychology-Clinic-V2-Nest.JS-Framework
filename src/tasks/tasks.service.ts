import { Injectable } from "@nestjs/common";
import { ChangeBookingStatus } from "./jobs/change-booking-status.job";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class TaskService {
  constructor(private readonly changeBookingStatus: ChangeBookingStatus) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  changeStatus() {
    this.changeBookingStatus.changeStatus();
  }
}
