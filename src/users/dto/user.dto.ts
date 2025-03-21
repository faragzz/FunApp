import {IsEmail, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsString()
    name: string

    @ApiProperty({ example: 'johndoe@example.com', description: 'Unique email of the user' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 30.033, description: 'Latitude of the user\'s location' })
    @IsNumber()
    latitude: number

    @ApiProperty({ example: 31.233, description: 'Longitude of the user\'s location' })
    @IsNumber()
    longitude: number
}
