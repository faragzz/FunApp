import {Injectable} from '@nestjs/common';
import {UserDto} from "./dto/user.dto";
import {UserResponseData} from "./type/type";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./schema/user.entity";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    }

    private userResponseData: UserResponseData = {
        name: "John Doe",
        email: "johndoe@example.com",
        city: "Cairo"
    };


    findOne(id: string): UserResponseData {
        return this.userResponseData;
    }

    signup(userObject: UserDto) {
        const user = this.userRepository.create()
    }

}
