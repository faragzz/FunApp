import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {ConfigService} from "@nestjs/config";
import {User} from "../users/schema/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {
    }

    /**
     * Generates an access token for a user.
     *
     * @param {number} id - The user ID.
     * @param {string} name - The user's name.
     * @returns {string} The generated JWT access token.
     */
    generateAccessToken(id: number, name: string): string {
        return this.jwtService.sign(
            {sub: id, name: name},
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '15m',
            }
        );
    }

    /**
     * Generates a refresh token for a user.
     *
     * @param {number} id - The user ID.
     * @returns {string} The generated JWT refresh token.
     */
    generateRefreshToken(id: number): string {
        return this.jwtService.sign(
            {sub: id},
            {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }
        );
    }

    /**
     * Refreshes access and refresh tokens using a valid refresh token.
     *
     * @param {string} refreshToken - The current refresh token.
     * @returns {Promise<{ access_token: string, refresh_token: string }>} New access and refresh tokens.
     * @throws {UnauthorizedException} If the refresh token is invalid or expired.
     */
    async updateRefreshTokens(refreshToken: string): Promise<{ access_token: string, refresh_token: string }> {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            const user = await this.usersService.findOne(decoded.sub);
            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const accessToken = this.generateAccessToken(user.id, user.name);
            const newRefreshToken = this.generateRefreshToken(user.id);

            await this.usersService.updateRefreshToken(user.id, newRefreshToken);

            return {access_token: accessToken, refresh_token: newRefreshToken};
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
