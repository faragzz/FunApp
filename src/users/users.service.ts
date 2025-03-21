import {Injectable} from '@nestjs/common';
import {UserDto} from "./dto/user.dto";
import {UserResponseData} from "./type/type";

@Injectable()
export class UsersService {
    private userResponseData: UserResponseData = {
        name: "John Doe",
        email: "johndoe@example.com",
        city: "Cairo"
    };


    findOne(id: string): UserResponseData {
        return this.userResponseData;
    }

    signup(userObject: UserDto) {
        return "created";
    }

}
