import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
  Query,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";
import { Request } from "express";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Roles } from "src/common/decorators/roles.decorator";

@ApiTags("Reviews")
@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiCreatedResponse({
    description: "نظر با موفقیت ثبت شد",
    schema: {
      example: {
        message:
          "Your comment has been successfully submitted and will be visible after approval by the administrator.",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "خطای اعتبارسنجی در داده‌های ورودی",
    schema: {
      example: {
        message: [
          "content must be a string",
          "content must be longer than or equal to 5 characters",
          "rating must be a number",
          "rating must be between 1 and 5",
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
    description: "حساب کاربر مسدود شده است",
    schema: {
      example: {
        message: ["Your Account Already Banned !!"],
        error: "Forbidden",
        statusCode: 403,
      },
    },
  })
  @ApiConflictResponse({
    description: "روان‌شناس غیرفعال یا نظر تکراری",
    schema: {
      example: {
        message: [
          "This Psychologist Not Active !!",
          "This Comment Already Exist !!",
        ],
        error: "Conflict",
        statusCode: 409,
      },
    },
  })
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.FORM)
  @UseGuards(CustomAuthGuard)
  @ApiOperation({ summary: "Users can post their comments." })
  @Post(":psychologistId/create")
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Param("psychologistId", ParseIntPipe) psychologistId: number,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.reviewService.create(createReviewDto, psychologistId, userId);
  }

  @ApiOperation({
    summary: "Users can read what others have to say about the psychologist.",
  })
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiQuery({ name: "page", example: 1, required: false })
  @ApiQuery({ name: "limit", example: 10, required: false })
  @ApiQuery({ name: "search", example: "دکتر", required: false })
  @ApiResponse({
    status: 200,
    description: "نظرات روان‌شناس با موفقیت دریافت شدند",
    schema: {
      example: {
        data: [
          {
            id: 1,
            content: "Great psychologist!",
            createdAt: "2025-11-01T10:00:00Z",
            rating: 5,
            user: { name: "John Doe" },
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
    status: 400,
    description: "خطای اعتبارسنجی در داده‌های ورودی",
    schema: {
      example: {
        message: ["page must be a number", "limit must be a number"],
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "نظری یافت نشد",
    schema: {
      example: {
        message: ["No Comments Found !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @Get("psychologist/:id")
  psychologistReviews(
    @Param("id", ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.reviewService.psychologistReviews(id, paginationDto);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiOperation({ summary: "Admin can See All comments." })
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiQuery({ name: "page", example: 1, required: false })
  @ApiQuery({ name: "limit", example: 10, required: false })
  @ApiQuery({ name: "search", example: "دکتر", required: false })
  @ApiResponse({
    status: 200,
    description: "نظرات با موفقیت دریافت شدند",
    schema: {
      example: {
        data: [
          {
            id: 1,
            content: "Great psychologist!",
            isAccept: true,
            rating: 5,
            createdAt: "2025-11-01T10:00:00Z",
            psychologist: { name: "Dr. Smith" },
            user: { name: "John Doe" },
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
    status: 400,
    description: "خطای اعتبارسنجی در داده‌های ورودی",
    schema: {
      example: {
        message: [
          "page must be a number",
          "limit must be a number",
          "search must be a string",
        ],
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "نظری یافت نشد",
    schema: {
      example: {
        message: ["No Comment Found !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @Get("admin/all")
  adminFindAll(@Query() paginationDto: PaginationDto) {
    return this.reviewService.findAll(paginationDto);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiOperation({ summary: "Admin can Get Main Comment." })
  @ApiResponse({
    status: 200,
    description: "نظر با موفقیت دریافت شد",
    schema: {
      example: {
        id: 1,
        content: "Great psychologist!",
        isAccept: true,
        rating: 5,
        createdAt: "2025-11-01T10:00:00Z",
        updatedAt: "2025-11-01T10:00:00Z",
        psychologist: { id: 1, name: "Dr. Smith" },
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "نظر یافت نشد",
    schema: {
      example: {
        message: ["Comment Not Found !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @Get("admin/:id")
  adminFindOne(@Param("id", ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiOperation({ summary: "Admin can Approve Or Reject Comments." })
  @ApiResponse({
    status: 200,
    description: "وضعیت تأیید نظر با موفقیت تغییر کرد",
    schema: {
      example: {
        message: "Comment Approved Successfully.",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "نظر یافت نشد",
    schema: {
      example: {
        message: ["Comment Not Found !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @Patch("admin/toggleApproval/:id")
  toggleApproval(@Param("id", ParseIntPipe) id: number) {
    return this.reviewService.toggleApproval(id);
  }

  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiOperation({ summary: "Admin can Remove Comments." })
  @ApiResponse({
    status: 200,
    description: "نظر با موفقیت حذف شد",
    schema: {
      example: {
        message: "Comment Removed Successfully.",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "نظر یافت نشد",
    schema: {
      example: {
        message: ["Comment Not Found !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @Delete("admin/remove/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }
}
