import { PartialType } from "@nestjs/swagger";
import { SendOtpDto } from "./auth.dto";

export class UpdateAuthDto extends PartialType(SendOtpDto) {}
