import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn().mockResolvedValue({id: 123, name: 'Ahmed'}),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mockedAccessToken'),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('mockedSecret'),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Token Generation', () => {
        it('should generate an access token', async () => {
            const id = 123;
            const name = 'Ahmed';
            const token = await service.generateAccessToken(id, name);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });

        it('should generate a refresh token', async () => {
            const id = 123;
            const token = await service.generateRefreshToken(id);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });
    });
});
