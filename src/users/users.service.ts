import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserDto} from "./dto/user.dto";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./schema/user.entity";
import {GeolocationService} from "../geolocation/geolocation.service";
import {GeoDetailsResponse} from "../geolocation/type";
import {AuthService} from "../auth/auth.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, @Inject(forwardRef(() => AuthService)) private authService: AuthService, private geoLocationService: GeolocationService) {
    }

    private userResponseData: User = {
        id: 0, refreshToken: "",
        name: "John Doe",
        email: "johndoe@example.com",
        city: "Cairo"
    };


    async findOne(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({id});
    }

    async signup(user: UserDto) {
        const geoDetails: GeoDetailsResponse = await this.geoLocationService.getCityAndCountry(user.latitude, user.longitude)
        if (geoDetails.country !== "Egypt") {
            return "user must be in Egypt"
        }
        const userData = await this.userRepository.findOne({
            where: {email: user.email},
        });
        if (!userData) {
            throw new UnauthorizedException('Unauthorized');
        }
        const access_token = this.authService.generateAccessToken(userData);
        const refresh_token = this.authService.generateRefreshToken(userData);
        const newUserInfo: Omit<User, 'id'> = {
            city: geoDetails.city,
            email: user.email,
            name: user.name,
            refreshToken: refresh_token,
        };
        const newUser = this.userRepository.create(newUserInfo)
        const savedUser = await this.userRepository.save(newUser);

        return {...savedUser, access_token, refresh_token}
    }

    async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
        const hashedToken = await bcrypt.hash(refreshToken, 10); // Hash the refresh token for security
        await this.userRepository.update(id, {refreshToken: hashedToken});
    }

}
