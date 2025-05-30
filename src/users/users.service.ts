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
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        private geoLocationService: GeolocationService
    ) {
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param {number} id - The ID of the user.
     * @returns {Promise<User | null>} The user object or null if not found.
     */
    async findOne(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({id});
    }

    /**
     * Retrieves all users.
     *
     * @returns {Promise<User[]>} An array of all users.
     */
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    /**
     * Deletes all users from the database.
     */
    async deleteAll() {
        await this.userRepository.clear();
    }

    /**
     * Registers a new user if they are located in Egypt.
     *
     * @param {UserDto} user - The user data transfer object.
     * @returns {Promise<any>} The saved user with an access token or an error message.
     * @throws {UnauthorizedException} If the user already exists or is not in Egypt.
     */
    async signUp(user: UserDto) {
        const geoDetails: GeoDetailsResponse = await this.geoLocationService.getCityAndCountry(user.latitude, user.longitude);

        if (geoDetails.country !== "Egypt") {
            return "User must be in Egypt";
        }

        const userData = await this.userRepository.findOne({where: {email: user.email}});

        if (userData) {
            throw new UnauthorizedException('Unauthorized');
        }

        const newUserInfo = {
            city: geoDetails.city,
            email: user.email,
            name: user.name,
        };

        const newUser = this.userRepository.create(newUserInfo);
        const savedUser = await this.userRepository.save(newUser);

        const access_token = this.authService.generateAccessToken(savedUser.id, savedUser.name);
        const refresh_token = this.authService.generateRefreshToken(savedUser.id);

        const newSavedUser = await this.updateRefreshToken(savedUser.id, refresh_token);

        return {...newSavedUser, access_token};
    }

    /**
     * Updates the refresh token for a given user by hashing the new token.
     *
     * @param {number} id - The ID of the user.
     * @param {string} refreshToken - The new refresh token to be hashed and stored.
     * @returns {Promise<User>} The updated user object.
     */
    async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(id, {refreshToken: hashedToken});
        return await this.findOne(id) as User;
    }
}
