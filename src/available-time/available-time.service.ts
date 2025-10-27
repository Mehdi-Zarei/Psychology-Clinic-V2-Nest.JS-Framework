import { Injectable } from '@nestjs/common';
import { CreateAvailableTimeDto } from './dto/create-available-time.dto';
import { UpdateAvailableTimeDto } from './dto/update-available-time.dto';

@Injectable()
export class AvailableTimeService {
  create(createAvailableTimeDto: CreateAvailableTimeDto) {
    return 'This action adds a new availableTime';
  }

  findAll() {
    return `This action returns all availableTime`;
  }

  findOne(id: number) {
    return `This action returns a #${id} availableTime`;
  }

  update(id: number, updateAvailableTimeDto: UpdateAvailableTimeDto) {
    return `This action updates a #${id} availableTime`;
  }

  remove(id: number) {
    return `This action removes a #${id} availableTime`;
  }
}
