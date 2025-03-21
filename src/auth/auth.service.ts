import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {ConfigService} from "@nestjs/config";
import {User} from "../users/schema/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@Inject(forwardRef(() => UsersService)) private usersService: UsersService,
                private jwtService: JwtService,
                private configService: ConfigService) {
    }

    generateAccessToken(id: number, name: string) {
        return this.jwtService.sign(
            {sub: id, name: name},
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '15m',
            },
        );
    }

    generateRefreshToken(id: number) {
        return this.jwtService.sign(
            {sub: id},
            {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            },
        );
    }

    async updateRefreshToken(id: number, refreshToken: string) {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshToken(id, hashedToken);
    }

    async refreshTokens(refreshToken: string) {
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
