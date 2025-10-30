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
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { PsychologistService } from "./psychologist.service";
import { CreatePsychologistDto } from "./dto/create-psychologist.dto";
import { UpdatePsychologistDto } from "./dto/update-psychologist.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/upload/multer.config";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller("psychologist")
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @ApiOperation({ summary: "Psychologists can register on the site." })
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN", "USER")
  @UseInterceptors(
    FileInterceptor(
      "avatar",
      multerConfig("public/images/psychologist-profile/", 2, [
        ".jpg",
        ".jpeg",
        ".png",
      ]),
    ),
  )
  @Post("register")
  register(
    @Body() createPsychologistDto: CreatePsychologistDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.psychologistService.register(
      createPsychologistDto,
      userId,
      file,
    );
  }

  @ApiOperation({ summary: "Admin can activate or deactivate a psychologist." })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @Patch(":id/active")
  toggleActiveStatus(@Param("id", ParseIntPipe) id: number) {
    return this.psychologistService.toggleActiveStatus(id);
  }

  @ApiOperation({ summary: "Admin Get All Psychologist." })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "search", required: false })
  @Get("all")
  adminGetAll(@Query() paginationDto: PaginationDto) {
    return this.psychologistService.adminGetAll(paginationDto);
  }

  @ApiOperation({ summary: "User Get All Active Psychologist." })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "search", required: false })
  @Get()
  userGetAll(@Query() paginationDto: PaginationDto) {
    return this.psychologistService.userGetAll(paginationDto);
  }
}
