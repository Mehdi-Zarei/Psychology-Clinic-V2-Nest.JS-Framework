import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePsychologistDto } from "./dto/create-psychologist.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PsychologistEntity } from "./entities/psychologist.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationResult } from "src/common/dto/pagination-result.dto";

@Injectable()
export class PsychologistService {
  constructor(
    @InjectRepository(PsychologistEntity)
    private readonly psychologistRepository: Repository<PsychologistEntity>,
  ) {}

  async register(
    createPsychologistDto: CreatePsychologistDto,
    userId: number,
    file: Express.Multer.File,
  ) {
    const {
      name,
      education,
      licenseNumber,
      aboutMe,
      experienceYears,
      specialization,
      avatar,
    } = createPsychologistDto;

    const isPsychologistExist = await this.psychologistRepository.findOne({
      where: { licenseNumber },
    });

    if (isPsychologistExist) {
      throw new ConflictException("This Psychologist Already Registered !!");
    }

    const newPsychologist = this.psychologistRepository.create({
      name,
      education,
      licenseNumber,
      aboutMe,
      experienceYears,
      specialization,
      avatar: `${process.env.DOMAIN}/${file.path.slice(7)}`,
      isActive: false,
      user: { id: userId },
    });

    await this.psychologistRepository.save(newPsychologist);

    return { message: "Psychologist Registered Successfully." };
  }

  async toggleActiveStatus(id: number) {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id },
    });

    if (!psychologist) {
      throw new NotFoundException("Psychologist Not Found !!");
    }

    psychologist.isActive = !psychologist.isActive;
    await this.psychologistRepository.save(psychologist);

    return {
      message: psychologist.isActive
        ? "Psychologist's account has been successfully approved."
        : "The psychologist's account has been successfully deactivated",
    };
  }

  async adminGetAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1, search } = paginationDto;

    const queryBuilder =
      this.psychologistRepository.createQueryBuilder("psychologist");

    if (search) {
      queryBuilder.where(
        `psychologist.name ILIKE :search OR :search = ANY (psychologist.specialization)`,
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy("psychologist.createdAt", "DESC");

    const [data, total] = await queryBuilder.getManyAndCount();

    if (!total) {
      throw new NotFoundException("No psychologists found.");
    }

    const paginationData = new PaginationResult(data, total, page, limit);
    return { paginationData };
  }

  async userGetAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1, search } = paginationDto;

    const queryBuilder = this.psychologistRepository
      .createQueryBuilder("psychologist")
      .where("psychologist.isActive = true");

    if (search) {
      queryBuilder.andWhere(
        `psychologist.name ILIKE :search 
       OR :search = ANY (psychologist.specialization)`,
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy("psychologist.createdAt", "DESC");

    const [data, total] = await queryBuilder.getManyAndCount();

    if (!total) {
      throw new NotFoundException("Psychologist Not Found !!");
    }

    const paginationData = new PaginationResult(data, total, page, limit);

    return paginationData;
  }
}
