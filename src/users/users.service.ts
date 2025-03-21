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

    async findOne(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({id});
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async deleteAll(): Promise<void> {
        await this.userRepository.clear();
    }

    async signup(user: UserDto) {
        const geoDetails: GeoDetailsResponse = await this.geoLocationService.getCityAndCountry(user.latitude, user.longitude)
        if (geoDetails.country !== "Egypt") {
            return "user must be in Egypt"
        }
        const userData = await this.userRepository.findOne({
            where: {email: user.email},
        });
        if (userData) {
            throw new UnauthorizedException('Unauthorized');
        }
        const newUserInfo = {
            city: geoDetails.city,
            email: user.email,
            name: user.name,
        };
        const newUser = this.userRepository.create(newUserInfo)
        const savedUser = await this.userRepository.save(newUser);

        const access_token = this.authService.generateAccessToken(savedUser.id, savedUser.name);
        const refresh_token = this.authService.generateRefreshToken(savedUser.id);

        const newSavedUser = await this.updateRefreshToken(savedUser.id, refresh_token);

        return {...newSavedUser, access_token}
    }

    async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(id, {refreshToken: hashedToken});
        return await this.findOne(id) as User;
    }


}
