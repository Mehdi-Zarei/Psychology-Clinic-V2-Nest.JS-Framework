import { PartialType } from '@nestjs/swagger';
import { CreateAvailableTimeDto } from './create-available-time.dto';

export class UpdateAvailableTimeDto extends PartialType(CreateAvailableTimeDto) {}
