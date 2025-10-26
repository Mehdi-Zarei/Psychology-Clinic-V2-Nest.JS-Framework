import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from "class-validator";

export class SendOtpDto {
  @ApiProperty({ example: "09123456789" })
  @IsPhoneNumber("IR")
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: "09123456789" })
  @IsPhoneNumber("IR")
  phone: string;

  @ApiProperty({ example: "12345" })
  @Length(5)
  @IsNotEmpty()
  @IsNumberString()
  code: string;
}

export class RegisterDto {
  @ApiProperty({ example: "Mehdi" })
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  name: string;

  @ApiProperty({ example: "09123456789" })
  @IsPhoneNumber("IR")
  phone: string;

  @ApiPropertyOptional({ example: "Mehdi@12345" })
  @IsOptional()
  @Length(8, 50)
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
