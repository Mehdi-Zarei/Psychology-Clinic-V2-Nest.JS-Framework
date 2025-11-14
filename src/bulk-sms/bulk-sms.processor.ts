import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { SmsService } from "../sms/sms.service";

@Processor("Bulk-SMS")
export class BulkSmsProcessor {
  constructor(private readonly smsService: SmsService) {}

  @Process({ name: "sendBulkSms", concurrency: 1 })
  async handleSendSms(job: Job<{ phoneNumber: string; message: string }>) {
    const { phoneNumber, message } = job.data;

    try {
      const sms = await this.smsService.sendSms(
        phoneNumber,
        process.env.ANNIVERSARY_PATTERN!,
        process.env.ANNIVERSARY_VARIABLE!,
        message,
      );

      if (!sms.success) {
        console.error(`❌ SMS failed to ${phoneNumber}`);
        throw new Error(`SMS_FAILED_${phoneNumber}`);
      }

      console.log(`✅ SMS sent to ${phoneNumber}`);
      return true;
    } catch (err) {
      console.error(`❌ FAILED for ${phoneNumber}:`, err);
      throw new Error(`SMS_RETRY_${phoneNumber}`);
    }
  }
}
