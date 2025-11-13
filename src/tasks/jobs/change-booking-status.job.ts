import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BookingEntity } from "src/booking/entities/booking.entity";
import { Repository } from "typeorm";

export class ChangeBookingStatus {
  private readonly logger = new Logger(ChangeBookingStatus.name);

  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async changeStatus() {
    this.logger.log("Checking for expired bookings...");

    const appointments = await this.bookingRepository.find({});

    for (const appointment of appointments) {
      if (
        appointment.endTime.getTime() < Date.now() &&
        appointment.status === "reserved"
      ) {
        appointment.status = "done";
        await this.bookingRepository.save(appointment);
      }
    }
  }
}
