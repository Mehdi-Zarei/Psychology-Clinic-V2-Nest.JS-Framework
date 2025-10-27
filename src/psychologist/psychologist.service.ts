import { Injectable } from '@nestjs/common';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';

@Injectable()
export class PsychologistService {
  create(createPsychologistDto: CreatePsychologistDto) {
    return 'This action adds a new psychologist';
  }

  findAll() {
    return `This action returns all psychologist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} psychologist`;
  }

  update(id: number, updatePsychologistDto: UpdatePsychologistDto) {
    return `This action updates a #${id} psychologist`;
  }

  remove(id: number) {
    return `This action removes a #${id} psychologist`;
  }
}
