import { Module } from "@nestjs/common";
import { BulkSmsService } from "./bulk-sms.service";
import { BulkSmsController } from "./bulk-sms.controller";
import { BullModule } from "@nestjs/bull";
import { UserModule } from "src/user/user.module";
import { JwtService } from "@nestjs/jwt";
import { SmsModule } from "src/sms/sms.module";
import { BulkSmsProcessor } from "./bulk-sms.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "Bulk-SMS",
      limiter: {
        max: 1,
        duration: 2000,
      },
    }),
    UserModule,
    SmsModule,
  ],
  controllers: [BulkSmsController],
  providers: [BulkSmsService, JwtService, BulkSmsProcessor],
})
export class BulkSmsModule {}
