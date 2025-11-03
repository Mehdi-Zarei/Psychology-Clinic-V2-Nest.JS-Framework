import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { Request } from "express";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiOperation({ summary: "Users Can Booking Appointments." })
  @ApiResponse({
    status: 201,
    description: "نوبت با موفقیت رزرو شد",
    schema: {
      example: {
        message: "Your appointment has been successfully booked.",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "خطای اعتبارسنجی یا روان‌شناس/نوبت در دسترس نیست",
    schema: {
      example: {
        message: [
          "Psychologist not found or inactive!",
          "This appointment is no longer available!",
        ],
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @Post(":psychologistId")
  create(
    @Body() createBookingDto: CreateBookingDto,
    @Param("psychologistId", ParseIntPipe) psychologistId: number,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.bookingService.create(createBookingDto, userId, psychologistId);
  }

  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiBearerAuth("accessToken")
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "search", required: false })
  @ApiOperation({ summary: "Admin Can See All Booking Appointments." })
  @ApiResponse({
    status: 200,
    description: "نوبت‌ها با موفقیت دریافت شدند",
    schema: {
      example: {
        data: [
          {
            id: 1,
            date: "2025-11-02T00:00:00Z",
            startTime: "2025-11-02T10:00:00Z",
            endTime: "2025-11-02T11:00:00Z",
            status: "reserved",
            user: { id: 1, name: "John Doe" },
            psychologist: { id: 1, name: "Dr. Smith" },
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "نوبتی یافت نشد",
    schema: {
      example: {
        message: ["No appointment found !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @Get("admin/getAll")
  findAll(@Query() paginationDto: PaginationDto) {
    return this.bookingService.findAll(paginationDto);
  }

  @ApiOperation({ summary: "People Can See Special Free Time." })
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiResponse({
    status: 200,
    description: "زمان آزاد با موفقیت دریافت شد",
    schema: {
      example: {
        availableTime: {
          id: 1,
          date: "2025-11-02T00:00:00Z",
          startTime: "2025-11-02T10:00:00Z",
          endTime: "2025-11-02T11:00:00Z",
          isBooked: false,
          psychologist: { id: 1, name: "Dr. Smith" },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "زمان آزاد یافت نشد",
    schema: {
      example: {
        message: ["Available Time Not Found With This ID !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.bookingService.findOne(id);
  }

  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin/Psychologist Can Edit Their Free Times." })
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @Patch("admin/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: Request,
  ) {
    const psychologistId = req.user.id;
    return this.bookingService.update(id, psychologistId, updateBookingDto);
  }

  @ApiOperation({
    summary:
      "The Admin or psychologist can eliminate others'/their own free time.",
  })
  @ApiConsumes(SwaggerConsumes.FORM)
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @ApiBearerAuth("accessToken")
  @Delete("admin/:id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user.id;
    return this.bookingService.remove(id, userId);
  }
}
