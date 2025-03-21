import {IsEmail, IsNumber, IsString} from "class-validator";

export class UserDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsNumber()
    latitude: number

    @IsNumber()
    longitude: number
}
