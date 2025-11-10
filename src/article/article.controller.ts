import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
  ParseIntPipe,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/upload/multer.config";
import { Request } from "express";

@ApiTags("Article")
@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiResponse({
    status: 201,
    description: "مقاله با موفقیت ایجاد شد",
    schema: {
      example: {
        message: "Article Created Successfully.",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "خطای اعتبارسنجی در داده‌های ورودی",
    schema: {
      example: {
        message: [
          "title must be a string",
          "content must be a string",
          "summary must be a string",
          "isPublished must be a boolean",
          "readingTime must be a number",
          "seoDescription must be a string",
          "seoTitle must be a string",
          "tags must be an array of strings",
        ],
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "مقاله یا اسلاگ تکراری است",
    schema: {
      example: {
        message: ["Article is repetitive."],
        error: "Conflict",
        statusCode: 409,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "خطای سرور",
    schema: {
      example: {
        message: ["Internal server error"],
        error: "Internal Server Error",
        statusCode: 500,
      },
    },
  })
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin Or Psychologists Can Create Articles." })
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @UseInterceptors(
    FilesInterceptor(
      "images",
      10,
      multerConfig("public/images/article/", 3, [".jpg", ".jpeg", ".png"]),
    ),
  )
  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: Request,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    const userId = req.user.id;
    return this.articleService.create(createArticleDto, userId, file);
  }

  @ApiResponse({
    status: 200,
    description: "مقالات با موفقیت دریافت شدند",
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: "Sample Article",
            summary: "A brief summary.",
            images: ["http://domain.com/images/article/sample.jpg"],
            author: { id: 1, name: "John Doe" },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "مقاله‌ای یافت نشد",
    schema: {
      example: {
        message: ["Article Not Found !!"],
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiOperation({ summary: "All Users Can Get All Published Articles." })
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: "مقاله با موفقیت دریافت شد",
    schema: {
      example: {
        id: 18,
        title: "راهکار های مقابله با افسردگی",
        content: "ورزش کردن مداوم یکی از راهکار های مقابله با افسردگی است.",
        author: {
          name: "Mehdi",
        },
        slug: "راهکار-های-مقابله-با-افسردگی",
        images: ["string"],
        shortIdentifier: "FbZyRgk",
        summary: "ورزش کردن مداوم یکی از راهکار های مقابله با افسردگی است.",
        tags: ["روانشناسی", "افسردگی"],
        isPublished: true,
        views: 6,
        readingTime: 10,
        seoTitle: "راهکار های مقابله با افسردگی",
        seoDescription:
          "تاثیر ورزش و فعالیت بندی مداوم در مقابله و درمان افسردگی",
        createdAt: "2025-11-09T14:29:52.363Z",
        updatedAt: "2025-11-09T15:15:15.894Z",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "مقاله یافت نشد",
    schema: {
      example: {
        message: "Article Not Found !!",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiOperation({ summary: "All users can access any published article." })
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: "مقاله با موفقیت به‌روزرسانی شد",
    schema: {
      example: {
        message: "Article Updated Successfully.",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "خطای اعتبارسنجی در داده‌های ورودی",
    schema: {
      example: {
        message: [
          "title must be a string",
          "content must be a string",
          "summary must be a string",
          "isPublished must be a boolean",
          "readingTime must be a number",
          "seoDescription must be a string",
          "seoTitle must be a string",
          "tags must be an array of strings",
        ],
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: "شما اجازه به‌روزرسانی این مقاله را ندارید",
    schema: {
      example: {
        message: "You Are Not Allowed To Update This Article.",
        error: "Forbidden",
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "مقاله یافت نشد",
    schema: {
      example: {
        message: "Article Not Found !!",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "خطای سرور",
    schema: {
      example: {
        message: "Internal server error",
        error: "Internal Server Error",
        statusCode: 500,
      },
    },
  })
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin Or Psychologists Can Update Articles." })
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @UseInterceptors(
    FilesInterceptor(
      "images",
      10,
      multerConfig("public/images/article/", 3, [".jpg", ".jpeg", ".png"]),
    ),
  )
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = req.user.id;

    return this.articleService.update(id, updateArticleDto, userId, files);
  }

  @ApiResponse({
    status: 403,
    description: "شما اجازه دسترسی به این مسیر رو ندارید.",
    schema: {
      example: {
        message:
          "You do not have permission to access this path. | You Are Not Allowed To Delete This Article.",
        error: "Forbidden",
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "مقاله با موفقیت حذف شد.",
    schema: {
      example: {
        message: "Article Removed Successfully.",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "مقاله‌ای یافت نشد",
    schema: {
      example: {
        message: "Article Not Found !!",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin Or Psychologists Can Remove Articles." })
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "PSYCHOLOGIST")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user.id;
    return this.articleService.remove(id, userId);
  }
}
