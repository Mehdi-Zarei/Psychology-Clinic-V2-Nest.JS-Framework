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
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
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

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articleService.remove(+id);
  }
}
