import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from "@nestjs/common";
import { AvailableTimeService } from "./available-time.service";
import { CreateAvailableTimeDto } from "./dto/create-available-time.dto";
import { Request } from "express";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";
import { UpdateAvailableTimeDto } from "./dto/update-available-time.dto";

@Controller("available-time")
export class AvailableTimeController {
  constructor(private readonly availableTimeService: AvailableTimeService) {}

  @ApiOperation({ summary: "Psychologist Can Create New Available Time." })
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
    return this.availableTimeService.addFreeTime(
      createAvailableTimeDto,
      userId,
    );
  }

  @ApiOperation({
    summary: "Users can receive free times of a specific psychologist.",
  })
  @Get(":psychologistId")
  getFreeTime(@Param("psychologistId", ParseIntPipe) id: number) {
    return this.availableTimeService.getFreeTime(id);
  }

  @ApiOperation({
    summary:
      "The admin or psychologist who created the free time can delete it.",
  })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @Delete(":id/remove")
  removeTime(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user.id;
    return this.availableTimeService.removeTime(id, userId);
  }

  @ApiOperation({
    summary:
      "The admin or psychologist who created the free time can update it.",
  })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @ApiConsumes(SwaggerConsumes.FORM)
  @Patch(":id/update")
  updateTime(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAvailableTimeDto: UpdateAvailableTimeDto,
    @Req()
    req: Request,
  ) {
    const userId = req.user.id;
    return this.availableTimeService.updateTime(
      id,
      userId,
      updateAvailableTimeDto,
    );
  }
}
