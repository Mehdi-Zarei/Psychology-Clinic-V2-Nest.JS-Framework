import { Module } from "@nestjs/common";
import { PsychologistService } from "./psychologist.service";
import { PsychologistController } from "./psychologist.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PsychologistEntity } from "./entities/psychologist.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PsychologistEntity])],
  controllers: [PsychologistController],
  providers: [PsychologistService],
})
export class PsychologistModule {}
