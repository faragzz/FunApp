import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocationService],
    }).compile();

    service = module.get<GeolocationService>(GeolocationService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    const data = await service.getCityAndCountry(31.195893, 29.907762)
    console.log(data)
  });
});
