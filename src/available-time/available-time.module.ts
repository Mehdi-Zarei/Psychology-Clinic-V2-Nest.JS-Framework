import { Module } from '@nestjs/common';
import { AvailableTimeService } from './available-time.service';
import { AvailableTimeController } from './available-time.controller';

@Module({
  controllers: [AvailableTimeController],
  providers: [AvailableTimeService],
})
export class AvailableTimeModule {}
