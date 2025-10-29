import { Module } from "@nestjs/common";
import { PsychologistService } from "./psychologist.service";
import { PsychologistController } from "./psychologist.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PsychologistEntity } from "./entities/psychologist.entity";
import { JwtService } from "@nestjs/jwt";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([PsychologistEntity]), UserModule],
  controllers: [PsychologistController],
  providers: [PsychologistService, JwtService],
})
export class PsychologistModule {}
