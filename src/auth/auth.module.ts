import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthController} from "./auth.controller";
import {UsersModule} from "../users/users.module";
import {AuthGuard} from "./auth.guard";
import {APP_GUARD} from "@nestjs/core";

@Module({
    imports: [
        forwardRef(() => UsersModule), JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '1h'},
            })
        }),
    ],
    controllers: [AuthController],
    providers: [{
        provide: APP_GUARD,
        useClass: AuthGuard,
    }, AuthService],
    exports: [AuthService]
})
export class AuthModule {
}
