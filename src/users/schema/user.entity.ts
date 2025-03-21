import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique ID of the user' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @ApiProperty({ example: 'johndoe@example.com', description: 'Email address of the user' })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty({ example: 'Cairo', description: 'City where the user is located' })
    city: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    @ApiProperty({ example: null, description: 'Refresh token for authentication can be nullable', nullable: true })
    refreshToken: string | null;
}
