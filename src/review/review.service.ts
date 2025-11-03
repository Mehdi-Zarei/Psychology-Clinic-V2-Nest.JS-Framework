import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";
import { ILike, Repository } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { ReviewEntity } from "./entities/review.entity";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationResult } from "src/common/dto/pagination-result.dto";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(PsychologistEntity)
    private readonly psychologistRepository: Repository<PsychologistEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    psychologistId: number,
    userId: number,
  ) {
    const { content, rating } = createReviewDto;

    const psychologist = await this.psychologistRepository.findOneBy({
      id: psychologistId,
    });
    if (!psychologist) {
      throw new NotFoundException("Psychologist Not Found !!");
    }

    if (!psychologist.isActive) {
      throw new ConflictException("This Psychologist Not Active !!");
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user?.isRestrict) {
      throw new ForbiddenException("Your Account Already Banned !!");
    }

    const isDuplicateComment = await this.reviewRepository.findOne({
      where: { content },
    });
    if (isDuplicateComment) {
      throw new ConflictException("This Comment Already Exist !!");
    }

    const newComment = this.reviewRepository.create({
      content,
      rating,
      isAccept: false,
      psychologist: { id: psychologist.id },
      user: { id: user?.id },
    });

    await this.reviewRepository.save(newComment);

    return {
      message:
        "Your comment has been successfully submitted and will be visible after approval by the administrator.",
    };
  }

  async psychologistReviews(id: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const [data, total] = await this.reviewRepository.findAndCount({
      where: { psychologist: { id }, isAccept: true },
      relations: {
        user: true,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        rating: true,
        user: { name: true },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!data.length) {
      throw new NotFoundException("No Comments Found !!");
    }
    const paginationData = new PaginationResult(data, total, page, limit);
    return paginationData;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;

    const where = search ? { content: ILike(`%${search}%`) } : {};

    const skip = (page - 1) * limit;

    const [data, total] = await this.reviewRepository.findAndCount({
      where,
      relations: {
        user: true,
        psychologist: true,
      },
      order: { createdAt: "DESC" },
      skip,
      take: limit,
      select: {
        id: true,
        content: true,
        isAccept: true,
        rating: true,
        createdAt: true,
        psychologist: { name: true },
        user: { name: true },
      },
    });

    if (!data) {
      throw new NotFoundException("No Comment Found !!");
    }

    const paginationData = new PaginationResult(data, total, page, limit);

    return paginationData;
  }

  async findOne(id: number) {
    const mainComment = await this.reviewRepository.findOne({
      where: { id },
      relations: { user: true, psychologist: true },
      select: {
        id: true,
        content: true,
        isAccept: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        psychologist: { id: true, name: true },
        user: { name: true, email: true, phone: true, id: true },
      },
    });
    if (!mainComment) {
      throw new NotFoundException("Comment Not Found !!");
    }

    return mainComment;
  }

  async toggleApproval(id: number) {
    const mainComment = await this.reviewRepository.findOne({ where: { id } });
    if (!mainComment) {
      throw new NotFoundException("Comment Not Found !!");
    }

    mainComment.isAccept = !mainComment.isAccept;
    await this.reviewRepository.save(mainComment);

    return {
      message: mainComment.isAccept
        ? "Comment Approved Successfully."
        : "Comment Rejected Successfully.",
    };
  }

  async remove(id: number) {
    const remove = await this.reviewRepository.delete(id);
    if (!remove.affected) {
      throw new NotFoundException("Comment Not Found !!");
    }

    return { message: "Comment Removed Successfully." };
  }
}
