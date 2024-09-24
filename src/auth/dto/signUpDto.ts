import { IsEmail, IsString, IsEnum, MinLength } from 'class-validator';
import { role } from '@prisma/client';  // Import Role from Prisma

export class SignUpDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsEnum(role, { message: 'Role must be either CLIENT or MANAGER' })
    role: role;
}