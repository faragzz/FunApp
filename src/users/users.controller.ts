import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UserDto} from "./dto/user.dto";
import {UsersService} from "./users.service";
import {Public} from "../guards/guards";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {User} from "./schema/user.entity";

@ApiTags('Users')
@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {
    }

    @Public()
    @Post('signup')
    @ApiOperation({summary: 'Sign up a new user'})
    @ApiResponse({status: 201, description: 'User created successfully', type: User})
    @ApiResponse({status: 400, description: 'Validation error'})
    @ApiBody({
        description: 'User sign-up data',
        required: true,
        type: UserDto,
        examples: {
            example1: {
                summary: 'Valid Input Example',
                value: {
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    latitude: 30.0444,
                    longitude: 31.2357
                }
            },
            example2: {
                summary: 'Another Example',
                value: {
                    name: 'Jane Doe',
                    email: 'janedoe@example.com',
                    latitude: 29.9737,
                    longitude: 31.2833
                }
            }
        }
    })
    signup(@Body() user: UserDto) {
        return this.userService.signUp(user);
    }

    @Get(':user_id')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Get user profile by ID'})
    @ApiResponse({status: 200, description: 'User profile retrieved', type: User})
    @ApiResponse({status: 404, description: 'User not found'})
    getUser(@Param('user_id') userId: number) {
        return this.userService.findOne(userId);
    }

    @Public()
    @Get()
    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, description: 'Users list retrieved', type: [User]})
    getAllUsers() {
        return this.userService.findAll();
    }

    @Public()
    @Delete()
    @ApiOperation({summary: 'Delete all users'})
    @ApiResponse({status: 200, description: 'All users deleted'})
    deleteAllUsers() {
        return this.userService.deleteAll();
    }
}
