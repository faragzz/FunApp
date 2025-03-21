import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private jwtService: JwtService,
                private configService:ConfigService ) {
    }

    private generateAccessToken(user: any) {
        return this.jwtService.sign(
            {sub: user.id, username: user.username},
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '15m',
            },
        );
    }

    private generateRefreshToken(user: any) {
        return this.jwtService.sign(
            {sub: user.id},
            {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            },
        );
    }
}
