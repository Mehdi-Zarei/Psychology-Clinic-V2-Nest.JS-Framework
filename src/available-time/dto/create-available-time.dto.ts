import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsOptional, Validate } from "class-validator";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "EndTimeAfterStartTime", async: false })
export class EndTimeAfterStartTime implements ValidatorConstraintInterface {
  validate(endTime: string, args: ValidationArguments) {
    const obj: any = args.object;
    if (!obj.startTime || !endTime) return true;
    return new Date(endTime).getTime() > new Date(obj.startTime).getTime();
  }

  defaultMessage() {
    return "endTime must be after startTime";
  }
}

export class CreateAvailableTimeDto {
  @ApiProperty({
    example: "2025-11-02T09:00:00Z",
    description: "Start time in ISO format (e.g., 2025-11-02T09:00:00Z)",
  })
  @IsDateString({}, { message: "startTime must be a valid ISO date string" })
  startTime: string;

  @ApiProperty({
    example: "2025-11-02T10:00:00Z",
    description: "End time in ISO format (must be after startTime)",
  })
  @IsDateString({}, { message: "endTime must be a valid ISO date string" })
  @Validate(EndTimeAfterStartTime)
  endTime: string;

  @ApiProperty({
    example: "2025-11-02",
    description: "The date of the time slot (used for daily grouping)",
  })
  @IsDateString({}, { message: "date must be a valid ISO date string" })
  date: string;

  @ApiProperty({
    example: false,
    description: "Indicates whether the slot is booked",
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isBooked?: boolean;
}
