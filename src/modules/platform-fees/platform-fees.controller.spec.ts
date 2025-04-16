import { Test, TestingModule } from '@nestjs/testing';
import { PlatformFeesController } from './platform-fees.controller';
import { PlatformFeesService } from './platform-fees.service';

describe('PlatformFeesController', () => {
  let controller: PlatformFeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformFeesController],
      providers: [PlatformFeesService],
    }).compile();

    controller = module.get<PlatformFeesController>(PlatformFeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
