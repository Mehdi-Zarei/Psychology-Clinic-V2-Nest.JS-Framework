import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async sendSms(phone: any, patternCode: any, variableName: any, value: any) {
    try {
      const response$ = this.httpService.post("http://ippanel.com/api/select", {
        op: "pattern",
        user: process.env.SMS_USER,
        pass: process.env.SMS_PASS,
        fromNum: "3000505",
        toNum: phone,
        patternCode,
        inputData: [
          {
            [variableName]: value,
          },
        ],
      });

      const response = await firstValueFrom(response$);

      if (!response.data || Array.isArray(response.data)) {
        throw new Error("SMS sending failed, ippanel response invalid");
      }

      if (typeof response.data === "number") {
        return { success: true };
      } else {
        console.log("SMS Response Error -->", response.data);
        throw new Error("SMS Response Error -->", response.data);
      }
    } catch (error) {
      console.error("SMS Error:", error?.response?.data || error);
      throw error;
    }
  }
}
