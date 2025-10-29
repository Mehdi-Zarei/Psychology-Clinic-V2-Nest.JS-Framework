import {
  BadRequestException,
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

@Injectable()
export class AvailableTimeService {
  constructor(
    @InjectRepository(AvailableTimeEntity)
    private readonly availableTimeRepository: Repository<AvailableTimeEntity>,

    @InjectRepository(PsychologistEntity)
    private readonly psychologistRepository: Repository<PsychologistEntity>,
  ) {}

  async create(createAvailableTimeDto: CreateAvailableTimeDto, userId: number) {
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
      psychologist: isPsychologistExist,
    });
    await this.availableTimeRepository.save(newAvailableTime);

    return { message: "New Time Set Successfully." };
  }
}
