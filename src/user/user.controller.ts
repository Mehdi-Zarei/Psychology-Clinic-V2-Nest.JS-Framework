import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ChangeUserRoleDto } from "./dto/create-user.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Request } from "express";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Get All Users." })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "search", required: false })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @Get()
  getAll(@Query() paginationDto: PaginationDto) {
    return this.userService.getAll(paginationDto);
  }

  @ApiOperation({ summary: "Toggle Restrict users." })
  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @Roles("ADMIN")
  @Patch(":id")
  toggleRestrict(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.toggleRestrict(userId);
  }

  @ApiOperation({ summary: "Get Me." })
  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @Get("me")
  getMet(@Req() req: Request) {
    const user = req.user as {
      name: string;
      email: string;
      phone: string;
    };

    return { name: user.name, phone: user.phone, email: user.email };
  }

  @ApiOperation({ summary: "Change users Roles." })
  @ApiBody({ type: ChangeUserRoleDto })
  @ApiConsumes(SwaggerConsumes.FORM)
  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @Roles("ADMIN")
  @Patch(":id/role")
  changeRole(
    @Param("id", ParseIntPipe) userId: number,
    @Body() changeUserRoleDto: ChangeUserRoleDto,
  ) {
    return this.userService.changeRole(userId, changeUserRoleDto);
  }
}
