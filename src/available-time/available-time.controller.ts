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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";
import { UpdateAvailableTimeDto } from "./dto/update-available-time.dto";

@Controller("available-time")
export class AvailableTimeController {
  constructor(private readonly availableTimeService: AvailableTimeService) {}

  @ApiCreatedResponse({
    description: "زمان آزاد با موفقیت اضافه شد",
    schema: {
      example: {
        message: "New Time Set Successfully.",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "خطای اعتبارسنجی در داده‌های ورودی",
    schema: {
      example: {
        message: [
          "date must be a valid ISO date string",
          "startTime must be a valid ISO date string",
          "endTime must be a valid ISO date string",
          "endTime must be after startTime",
        ],
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: "روان‌شناس یافت نشد",
    schema: {
      example: {
        message: ["Psychologist Not Found !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiForbiddenResponse({
    description: "حساب غیرفعال است",
    schema: {
      example: {
        message: ["Your Account Not Active !!"],
        error: "Forbidden",
        statusCode: 403,
      },
    },
  })
  @ApiConflictResponse({
    description: "بازه زمانی تکراری است",
    schema: {
      example: {
        message: ["This time slot already exists !!"],
        error: "Conflict",
        statusCode: 409,
      },
    },
  })
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
