import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvailableTimeService } from './available-time.service';
import { CreateAvailableTimeDto } from './dto/create-available-time.dto';
import { UpdateAvailableTimeDto } from './dto/update-available-time.dto';

@Controller('available-time')
export class AvailableTimeController {
  constructor(private readonly availableTimeService: AvailableTimeService) {}

  @Post()
  create(@Body() createAvailableTimeDto: CreateAvailableTimeDto) {
    return this.availableTimeService.create(createAvailableTimeDto);
  }

  @Get()
  findAll() {
    return this.availableTimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availableTimeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvailableTimeDto: UpdateAvailableTimeDto) {
    return this.availableTimeService.update(+id, updateAvailableTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availableTimeService.remove(+id);
  }
}
