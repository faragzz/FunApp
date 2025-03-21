import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UserDto} from "./dto/user.dto";
import {UsersService} from "./users.service";

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {
    }

    @Post('signup')
    signup(@Body() user: UserDto) {
        return this.userService.signup(user)
    }

    @Get(':user_id')
    getUserProfile(@Param('user_id') userId: string) {
        return this.userService.findOne(userId);
    }
}
