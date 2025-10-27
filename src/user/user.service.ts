import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { PaginationResult } from "src/common/dto/pagination-result.dto";
import { ChangeUserRoleDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;

    const queryBuilder = this.userRepository.createQueryBuilder("user");
    if (search) {
      queryBuilder.where(
        "user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search",
        {
          search: `%${search}%`,
        },
      );
    }

    queryBuilder.skip((page - 1) * limit).take(limit);
    queryBuilder.select([
      "user.id",
      "user.name",
      "user.email",
      "user.role",
      "user.createdAt",
      "user.updatedAt",
    ]);
    const [data, total] = await queryBuilder.getManyAndCount();
    if (total === 0) {
      throw new NotFoundException("User Not Found !!");
    }

    return new PaginationResult(data, total, page, limit);
  }

  async toggleRestrict(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User Not Found !!");
    }

    user.isRestrict = !user.isRestrict;
    await this.userRepository.save(user);

    return {
      message: user.isRestrict
        ? "User Banned Successfully."
        : "User Unbanned Successfully.",
    };
  }

  async changeRole(userId: number, changeUserRoleDto: ChangeUserRoleDto) {
    const { newRole } = changeUserRoleDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User Not Found !!");
    }

    user.role = newRole;
    await this.userRepository.save(user);

    return { message: `User Role Changed To : ${newRole}` };
  }
}
