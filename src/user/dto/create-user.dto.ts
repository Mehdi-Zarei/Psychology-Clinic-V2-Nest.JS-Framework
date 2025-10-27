import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class ChangeUserRoleDto {
  @ApiProperty({
    isArray: true,
    enum: ["ADMIN", "USER", "PSYCHOLOGIST"],
  })
  @IsEnum(["ADMIN", "USER", "PSYCHOLOGIST"])
  newRole: string;
}
