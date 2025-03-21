import {Test, TestingModule} from '@nestjs/testing';
import {GeolocationService} from './geolocation.service';

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
    });

    it('should output the exact location', async () => {
        const data = await service.getCityAndCountry(31.195893, 29.907762)
        expect(data).toEqual({city: 'Alexandria', country: 'Egypt'})
    });

});
