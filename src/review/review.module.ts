import { Module } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "src/user/user.module";
import { JwtService } from "@nestjs/jwt";
import { PsychologistEntity } from "src/psychologist/entities/psychologist.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, PsychologistEntity]),
    UserModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, JwtService],
})
export class ReviewModule {}
