import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendSms(userPhone: string, data: any): Promise<{ success: boolean }> {
    try {
      const response$ = this.httpService.post("http://ippanel.com/api/select", {
        op: "pattern",
        user: process.env.OTP_USER,
        pass: process.env.OTP_PASS,
        fromNum: "3000505",
        toNum: userPhone,
        patternCode: process.env.OTP_PATTERN,
        inputData: [{ [process.env.OTP_VARIABLE!]: data }],
      });

      const response = await firstValueFrom(response$);

      if (Array.isArray(response.data) || response.data.length > 1) {
        this.logger.error("SMS Error Body -->", response.data);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      this.logger.error("SMS Error -->", error);
      return { success: false };
    }
  }
}
