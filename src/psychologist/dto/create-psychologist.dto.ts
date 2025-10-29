import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumberString, IsString, Length } from "class-validator";

export class CreatePsychologistDto {
  @IsString()
  @Length(3, 15)
  @ApiProperty({ example: "Mehdi" })
  name: string;

  @ApiProperty({ type: "string", format: "binary" })
  avatar: string;

  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.split(",").map((v) => v.trim());
    }
    return value;
  })
  @ApiProperty({
    type: "array",
    example: ["Bachelor", "PhD"],
    items: { type: "string" },
  })
  @IsArray()
  @IsString({ each: true })
  education: string[];

  @ApiProperty({ example: 123456 })
  @IsNumberString()
  licenseNumber: number;

  @ApiProperty()
  @IsString()
  aboutMe: string;

  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.split(",").map((v) => v.trim());
    }
    return value;
  })
  @ApiProperty({ type: "array", example: ["Anxiety", "Trauma"] })
  @IsArray()
  @IsString({ each: true })
  specialization: string[];

  @ApiProperty({ example: 5 })
  @IsNumberString()
  experienceYears: number;
}
