import { Test, TestingModule } from '@nestjs/testing';
import { UtillsService } from './utills.service';

describe('UtillsService', () => {
  let service: UtillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtillsService],
    }).compile();

    service = module.get<UtillsService>(UtillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
