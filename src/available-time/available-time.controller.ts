import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { AvailableTimeService } from "./available-time.service";
import { CreateAvailableTimeDto } from "./dto/create-available-time.dto";
import { Request } from "express";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";

@Controller("available-time")
export class AvailableTimeController {
  constructor(private readonly availableTimeService: AvailableTimeService) {}

  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @ApiConsumes(SwaggerConsumes.FORM)
  @Post("add")
  create(
    @Body() createAvailableTimeDto: CreateAvailableTimeDto,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.availableTimeService.create(createAvailableTimeDto, userId);
  }
}
