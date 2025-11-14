import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional } from "class-validator";

export class SendBulkSmsDto {
  @ApiProperty({
    example: "🎉 سالگرد کلینیک ما مبارک!",
    description: "متن پیامک ارسالی به کاربران",
  })
  @IsString()
  message: string;
}
