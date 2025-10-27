import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PsychologistService } from './psychologist.service';
import { CreatePsychologistDto } from './dto/create-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';

@Controller('psychologist')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Post()
  create(@Body() createPsychologistDto: CreatePsychologistDto) {
    return this.psychologistService.create(createPsychologistDto);
  }

  @Get()
  findAll() {
    return this.psychologistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psychologistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsychologistDto: UpdatePsychologistDto) {
    return this.psychologistService.update(+id, updatePsychologistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psychologistService.remove(+id);
  }
}
