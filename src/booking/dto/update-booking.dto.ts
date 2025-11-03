import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateBookingDto } from "./create-booking.dto";
import {
  IsDateString,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
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

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({
    example: "2025-11-02T09:00:00Z",
    description: "Start time in ISO format (e.g., 2025-11-02T09:00:00Z)",
  })
  @IsOptional()
  @IsDateString({}, { message: "startTime must be a valid ISO date string" })
  startTime: string;

  @ApiProperty({
    example: "2025-11-02T10:00:00Z",
    description: "End time in ISO format (must be after startTime)",
  })
  @IsOptional()
  @IsDateString({}, { message: "endTime must be a valid ISO date string" })
  @Validate(EndTimeAfterStartTime)
  endTime: string;

  @ApiProperty({
    example: "2025-11-02",
    description: "The date of the time slot (used for daily grouping)",
  })
  @IsOptional()
  @IsDateString({}, { message: "date must be a valid ISO date string" })
  date: string;
}
