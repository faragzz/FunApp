import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const mockAuthService = {
            updateRefreshTokens: jest.fn().mockResolvedValue({
                access_token: 'mock_access_token',
                refresh_token: 'mock_refresh_token',
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{provide: AuthService, useValue: mockAuthService}],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should refresh tokens', async () => {
        const mockDto = {refreshToken: 'mock_refresh_token'};
        const result = await controller.updateRefreshToken(mockDto);
        expect(authService.updateRefreshTokens).toHaveBeenCalledWith(mockDto.refreshToken);
        expect(result).toEqual({
            access_token: 'mock_access_token',
            refresh_token: 'mock_refresh_token',
        });
    });
});
