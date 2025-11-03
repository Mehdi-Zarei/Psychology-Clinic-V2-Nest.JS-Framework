import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BookingEntity } from "./entities/booking.entity";
import { Between, DataSource, Repository } from "typeorm";
import { AvailableTimeEntity } from "src/available-time/entities/available-time.entity";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationResult } from "src/common/dto/pagination-result.dto";
import { skip } from "node:test";
import { CreateAvailableTimeDto } from "src/available-time/dto/create-available-time.dto";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,

    @InjectRepository(AvailableTimeEntity)
    private readonly availableTimeRepository: Repository<AvailableTimeEntity>,

    @InjectRepository(PsychologistEntity)
    private readonly PsychologistRepository: Repository<PsychologistEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: number,
    psychologistId: number,
  ) {
    const { date, startTime, endTime } = createBookingDto;

    const formattedDate = new Date(date);
    const formattedStartTime = new Date(startTime);
    const formattedEndTime = new Date(endTime);

    const startOfDay = new Date(formattedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(formattedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const psychologist = await this.PsychologistRepository.findOne({
      where: { id: psychologistId, isActive: true },
    });

    if (!psychologist) {
      throw new BadRequestException("Psychologist not found or inactive!");
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const availableTime = await queryRunner.manager.findOne(
        this.availableTimeRepository.target,
        {
          where: {
            date: Between(startOfDay, endOfDay),
            startTime: formattedStartTime,
            isBooked: false,
            psychologist: { id: psychologistId },
          },
          lock: { mode: "pessimistic_write" },
        },
      );

      if (!availableTime) {
        throw new BadRequestException(
          "This appointment is no longer available!",
        );
      }

      availableTime.isBooked = true;
      await queryRunner.manager.save(availableTime);

      const booking = this.bookingRepository.create({
        date: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        status: "reserved",
        user: { id: userId },
        psychologist: { id: psychologistId },
        availableTime: { id: availableTime.id },
      });

      await queryRunner.manager.save(booking);

      await queryRunner.commitTransaction();

      return { message: "Your appointment has been successfully booked." };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1, search } = paginationDto;

    const where = search ? `%${search}%` : {};

    const [data, total] = await this.bookingRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        user: true,
        psychologist: true,
      },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
        createdAt: true,
        user: { name: true },
        psychologist: { name: true },
      },
    });

    if (!data.length) {
      throw new NotFoundException("No appointment found !!");
    }

    const paginationData = new PaginationResult(data, total, page, limit);

    return paginationData;
  }

  async findOne(id: number) {
    const availableTime = await this.availableTimeRepository.findOneBy({ id });

    if (!availableTime) {
      throw new NotFoundException("Available Time Not Found With This ID !!");
    }

    return { availableTime };
  }

  async update(
    id: number,
    psychologistId: number,
    updateBookingDto: UpdateBookingDto,
  ) {
    const { startTime, endTime, date } = updateBookingDto;

    const formattedDate = new Date(date);
    const formattedStartTime = new Date(startTime);
    const formattedEndTime = new Date(endTime);

    const user = await this.userRepository.findOne({
      where: { id: psychologistId },
      relations: {
        psychologist: true,
      },
    });

    let whereCondition: any = {};

    if (user?.role === "ADMIN") {
      whereCondition = {
        id,
      };
    } else if (user?.role === "PSYCHOLOGIST") {
      whereCondition = {
        id,
        user: { id: psychologistId },
      };
    } else {
      throw new ForbiddenException(
        "You are not allowed to update this booking!",
      );
    }

    const time = await this.bookingRepository.findOne({
      where: whereCondition,
    });
    if (!time) {
      throw new NotFoundException("Booking Not Found !!");
    }

    if (date) time.date = formattedDate;
    if (startTime) time.startTime = formattedStartTime;
    if (endTime) time.endTime = formattedEndTime;

    await this.bookingRepository.save(time);

    return { message: "Booking Updated Successfully." };
  }

  async remove(id: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user?.role !== "ADMIN") {
      if (user?.id !== userId) {
        throw new ForbiddenException("You Don`t Have Access To This Action !!");
      }
    }

    const remove = await this.availableTimeRepository.findOne({
      where: { id },
    });

    if (!remove) {
      throw new NotFoundException("Available Time Not Found !!");
    }

    const booking = await this.bookingRepository.findOne({
      where: { availableTime: { id } },
      relations: ["availableTime"],
    });

    if (booking) {
      booking.status = "canceled";
      booking.availableTime = null;
      await this.bookingRepository.save(booking);
    }

    await this.availableTimeRepository.delete(id);

    return { message: "Time Removed Successfully." };
  }
}
