import { Test, TestingModule } from '@nestjs/testing';
import { PlatformFeesService } from './platform-fees.service';

describe('PlatformFeesService', () => {
  let service: PlatformFeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformFeesService],
    }).compile();

    service = module.get<PlatformFeesService>(PlatformFeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
