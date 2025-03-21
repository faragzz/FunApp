import {Test, TestingModule} from '@nestjs/testing';
import {UsersService} from './users.service';
import {Repository} from 'typeorm';
import {User} from './schema/user.entity';
import {getRepositoryToken} from '@nestjs/typeorm';
import {GeolocationService} from '../geolocation/geolocation.service';
import {AuthService} from '../auth/auth.service';
import {UserDto} from './dto/user.dto';
import {UnauthorizedException} from '@nestjs/common';

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_refresh_token'),
}));

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<User>;
    let geoLocationService: GeolocationService;
    let authService: AuthService;

    beforeEach(async () => {
        const mockUserRepository = {
            findOneBy: jest.fn(),
            find: jest.fn(),
            clear: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
        };

        const mockGeoLocationService = {
            getCityAndCountry: jest.fn().mockResolvedValue({city: 'Cairo', country: 'Egypt'}),
        };

        const mockAuthService = {
            generateAccessToken: jest.fn().mockReturnValue('mock_access_token'),
            generateRefreshToken: jest.fn().mockReturnValue('mock_refresh_token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {provide: getRepositoryToken(User), useValue: mockUserRepository},
                {provide: GeolocationService, useValue: mockGeoLocationService},
                {provide: AuthService, useValue: mockAuthService},
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        geoLocationService = module.get<GeolocationService>(GeolocationService);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a user if found', async () => {
            const mockUser = {id: 1, name: 'John Doe', email: 'johndoe@example.com'};
            userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);

            const result = await service.findOne(1);
            expect(userRepository.findOneBy).toHaveBeenCalledWith({id: 1});
            expect(result).toEqual(mockUser);
        });

        it('should return null if user is not found', async () => {
            userRepository.findOneBy = jest.fn().mockResolvedValue(null);
            const result = await service.findOne(1);
            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const mockUsers = [
                {id: 1, name: 'John Doe', email: 'johndoe@example.com'},
                {id: 2, name: 'Jane Doe', email: 'janedoe@example.com'},
            ];
            userRepository.find = jest.fn().mockResolvedValue(mockUsers);

            const result = await service.findAll();
            expect(userRepository.find).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });
    });

    describe('deleteAll', () => {
        it('should delete all users', async () => {
            userRepository.clear = jest.fn();
            await service.deleteAll();
            expect(userRepository.clear).toHaveBeenCalled();
        });
    });

    describe('signUp', () => {
        it('should throw an error if the user is not in Egypt', async () => {
            geoLocationService.getCityAndCountry = jest.fn().mockResolvedValue({city: 'New York', country: 'USA'});

            const userDto: UserDto = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                latitude: 40.7128,
                longitude: -74.006
            };

            await expect(service.signUp(userDto)).resolves.toEqual('User must be in Egypt');
        });

        it('should throw an UnauthorizedException if the user already exists', async () => {
            userRepository.findOne = jest.fn().mockResolvedValue({id: 1, email: 'johndoe@example.com'});

            const userDto: UserDto = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                latitude: 30.0444,
                longitude: 31.2357
            };

            await expect(service.signUp(userDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should create a new user and return tokens', async () => {
            userRepository.findOne = jest.fn().mockResolvedValue(null);
            userRepository.create = jest.fn().mockReturnValue({id: 1, name: 'John Doe', email: 'johndoe@example.com'});
            userRepository.save = jest.fn().mockResolvedValue({id: 1, name: 'John Doe', email: 'johndoe@example.com'});
            userRepository.update = jest.fn();

            const userDto: UserDto = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                latitude: 30.0444,
                longitude: 31.2357
            };

            const result = await service.signUp(userDto);
            expect(userRepository.save).toHaveBeenCalled();
            expect(authService.generateAccessToken).toHaveBeenCalledWith(1, 'John Doe');
            expect(authService.generateRefreshToken).toHaveBeenCalledWith(1);
            expect(result).toEqual(expect.objectContaining({access_token: 'mock_access_token'}));
        });
    });

    describe('updateRefreshToken', () => {
        it('should hash and update the refresh token', async () => {
            userRepository.update = jest.fn();
            userRepository.findOneBy = jest.fn().mockResolvedValue({id: 1, refreshToken: 'hashed_refresh_token'});

            const result = await service.updateRefreshToken(1, 'new_refresh_token');
            expect(userRepository.update).toHaveBeenCalledWith(1, {refreshToken: 'hashed_refresh_token'});
            expect(result).toEqual({id: 1, refreshToken: 'hashed_refresh_token'});
        });
    });
});
