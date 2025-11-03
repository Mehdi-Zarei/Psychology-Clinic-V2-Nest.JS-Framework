import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAvailableTimeDto } from "./dto/create-available-time.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AvailableTimeEntity } from "./entities/available-time.entity";
import { Between, Repository } from "typeorm";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import { UpdateAvailableTimeDto } from "./dto/update-available-time.dto";
import { BookingEntity } from "src/booking/entities/booking.entity";

@Injectable()
export class AvailableTimeService {
  constructor(
    @InjectRepository(AvailableTimeEntity)
    private readonly availableTimeRepository: Repository<AvailableTimeEntity>,

    @InjectRepository(PsychologistEntity)
    private readonly psychologistRepository: Repository<PsychologistEntity>,

    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async addFreeTime(
    createAvailableTimeDto: CreateAvailableTimeDto,
    userId: number,
  ) {
    const { date, startTime, endTime, isBooked } = createAvailableTimeDto;

    const isPsychologistExist = await this.psychologistRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!isPsychologistExist) {
      throw new NotFoundException("Psychologist Not Found !!");
    }

    if (!isPsychologistExist.isActive) {
      throw new ForbiddenException("Your Account Not Active !!");
    }

    const formattedDate = new Date(createAvailableTimeDto.date);
    const formattedStartTime = new Date(createAvailableTimeDto.startTime);

    const startOfDay = new Date(formattedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(formattedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const isRepeatingTime = await this.availableTimeRepository.findOne({
      where: {
        date: Between(startOfDay, endOfDay),
        startTime: formattedStartTime,
      },
    });

    if (isRepeatingTime) {
      throw new ConflictException("This time slot already exists !!");
    }
    const newAvailableTime = this.availableTimeRepository.create({
      date,
      endTime,
      startTime,
      isBooked,
      psychologist: { id: isPsychologistExist.id },
    });
    await this.availableTimeRepository.save(newAvailableTime);

    return { message: "New Time Set Successfully." };
  }

  async getFreeTime(id: number) {
    const availableTime = await this.availableTimeRepository.find({
      where: { psychologist: { id } },
    });

    if (!availableTime) {
      throw new NotFoundException("No Free Time Found !!");
    }

    return { availableTime };
  }

  async removeTime(id: number, userId: number) {
    const availableTime = await this.availableTimeRepository.findOne({
      where: { id },
      relations: ["psychologist", "psychologist.user"],
    });

    if (!availableTime) {
      throw new NotFoundException("Available Time Not Found !!");
    }

    if (availableTime.psychologist.user.role !== "ADMIN") {
      if (availableTime.psychologist.user.id !== userId) {
        throw new ForbiddenException("You are not allowed to delete this time");
      }
    }

    const isReserved = await this.bookingRepository.findOne({});
    await this.availableTimeRepository.remove(availableTime);

    return { message: "Available time removed successfully" };
  }

  async updateTime(
    id: number,
    userId: number,
    updateAvailableTimeDto: UpdateAvailableTimeDto,
  ) {
    const { date, endTime, isBooked, startTime } = updateAvailableTimeDto;

    const availableTime = await this.availableTimeRepository.findOne({
      where: { id },
      relations: ["psychologist", "psychologist.user"],
    });

    if (!availableTime) {
      throw new NotFoundException("Time Not Found !!");
    }

    if (availableTime.psychologist.user.role !== "ADMIN") {
      if (availableTime.psychologist.user.id !== userId) {
        throw new ForbiddenException("You are not allowed to update this time");
      }
    }

    const formattedDate = date ? new Date(date) : availableTime.date;
    const formattedStartTime = startTime
      ? new Date(startTime)
      : availableTime.startTime;

    const startOfDay = new Date(formattedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(formattedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingTime = await this.availableTimeRepository.findOne({
      where: {
        date: formattedDate,
        startTime: formattedStartTime,
      },
    });

    if (existingTime && existingTime.id !== id) {
      throw new ConflictException(
        "An available time with the same date and start time already exists.",
      );
    }

    if (date) availableTime.date = formattedDate;
    if (startTime) availableTime.startTime = new Date(startTime);
    if (endTime) availableTime.endTime = new Date(endTime);
    if (typeof isBooked === "boolean") availableTime.isBooked = isBooked;

    await this.availableTimeRepository.save(availableTime);

    console.log(isBooked);

    return {
      message: "Available time updated successfully.",
      data: availableTime,
    };
  }
}
