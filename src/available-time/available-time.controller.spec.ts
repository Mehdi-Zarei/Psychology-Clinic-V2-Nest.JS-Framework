import { Test, TestingModule } from '@nestjs/testing';
import { AvailableTimeController } from './available-time.controller';
import { AvailableTimeService } from './available-time.service';

describe('AvailableTimeController', () => {
  let controller: AvailableTimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableTimeController],
      providers: [AvailableTimeService],
    }).compile();

    controller = module.get<AvailableTimeController>(AvailableTimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
