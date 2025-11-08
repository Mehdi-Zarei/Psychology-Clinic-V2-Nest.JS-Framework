import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "./entities/article.entity";
import { UserModule } from "src/user/user.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), UserModule],
  controllers: [ArticleController],
  providers: [ArticleService, JwtService],
})
export class ArticleModule {}
