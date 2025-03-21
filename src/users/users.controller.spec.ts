import {Test, TestingModule} from '@nestjs/testing';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {UserDto} from './dto/user.dto';

describe('UsersController', () => {
    let controller: UsersController;
    let userService: UsersService;

    beforeEach(async () => {
        const mockUserService = {
            signUp: jest.fn().mockResolvedValue({
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                latitude: 30.0444,
                longitude: 31.2357
            }),
            findOne: jest.fn().mockResolvedValue({
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                latitude: 30.0444,
                longitude: 31.2357
            }),
            findAll: jest.fn().mockResolvedValue([
                {id: 1, name: 'John Doe', email: 'johndoe@example.com', latitude: 30.0444, longitude: 31.2357},
                {id: 2, name: 'Jane Doe', email: 'janedoe@example.com', latitude: 29.9737, longitude: 31.2833},
            ]),
            deleteAll: jest.fn().mockResolvedValue({message: 'All users deleted'}),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [{provide: UsersService, useValue: mockUserService}],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        userService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should sign up a user', async () => {
        const dto: UserDto = {name: 'John Doe', email: 'johndoe@example.com', latitude: 30.0444, longitude: 31.2357};
        const result = await controller.signup(dto);
        expect(userService.signUp).toHaveBeenCalledWith(dto);
        expect(result).toEqual({
            id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
            latitude: 30.0444,
            longitude: 31.2357
        });
    });

    it('should get a user by ID', async () => {
        const userId = 1;
        const result = await controller.getUser(userId);
        expect(userService.findOne).toHaveBeenCalledWith(userId);
        expect(result).toEqual({
            id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
            latitude: 30.0444,
            longitude: 31.2357
        });
    });

    it('should get all users', async () => {
        const result = await controller.getAllUsers();
        expect(userService.findAll).toHaveBeenCalled();
        expect(result).toEqual([
            {id: 1, name: 'John Doe', email: 'johndoe@example.com', latitude: 30.0444, longitude: 31.2357},
            {id: 2, name: 'Jane Doe', email: 'janedoe@example.com', latitude: 29.9737, longitude: 31.2833},
        ]);
    });

    it('should delete all users', async () => {
        const result = await controller.deleteAllUsers();
        expect(userService.deleteAll).toHaveBeenCalled();
        expect(result).toEqual({message: 'All users deleted'});
    });
});
