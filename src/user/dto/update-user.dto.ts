import { PartialType } from "@nestjs/swagger";
import { ChangeUserRoleDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(ChangeUserRoleDto) {}
