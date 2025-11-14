import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { SendBulkSmsDto } from "./dto/create-bulk-sm.dto";

@Injectable()
export class BulkSmsService {
  private readonly JOB_NAME = "sendBulkSms";

  constructor(
    @InjectQueue("Bulk-SMS") private readonly smsQueue: Queue,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async sendMultiSMS(sendBulkSmsDto: SendBulkSmsDto) {
    const users = await this.userRepository.find({
      where: { isRestrict: false },
      select: ["id", "phone"],
    });

    const jobs = users.map((user, index) => ({
      name: this.JOB_NAME,
      data: {
        phoneNumber: user.phone,
        message: sendBulkSmsDto.message,
      },
      opts: {},
    }));

    await this.smsQueue.addBulk(jobs);

    return {
      success: true,
      totalSms: users.length,
      message: "Bulk SMS jobs added to queue",
    };
  }
}
