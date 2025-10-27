import { PartialType } from '@nestjs/swagger';
import { CreatePsychologistDto } from './create-psychologist.dto';

export class UpdatePsychologistDto extends PartialType(CreatePsychologistDto) {}
