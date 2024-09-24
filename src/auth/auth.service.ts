import {PrismaClient, role, users} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {BadRequestException, Injectable, Post, Req, Request, UnauthorizedException, UseGuards} from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import {SignInDto} from "./dto/signInDto";
import {SignUpDto} from "./dto/signUpDto";

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
    async signup(signUpDto: SignUpDto) {
        try {
            const existingUser = await prisma.users.findUnique({
                where: {email: signUpDto.email},
            });

            if (existingUser) {
                throw new Error('Email already exists');
            }

            const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

            const roleEnum: role = this.getRoleFromString(signUpDto.role);

            const user = await prisma.users.create({
                data: {
                    email: signUpDto.email,
                    password: hashedPassword,
                    name: signUpDto.name,
                    role: roleEnum,
                },
            });

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            };
        } catch (error) {
            throw new BadRequestException(error.message);

        }
    }

    async signIn(signInDto: SignInDto) {
        try {
            const user = await prisma.users.findUnique({
                where: {email: signInDto.email},
            });

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const token = this.generateJwtToken(user);
            const refresh = this.generateRefreshToken(user);

            await prisma.tokens.create({
                data: {
                    user_id: user.id,
                    access_token: token,
                    refresh_token: refresh
                }
            })

            return {
                token: token,
                refresh_token: refresh,
                role: user.role
            };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async logout(@Request() req: Request) {
        const token = req.headers['authorization'];
        try {
            await prisma.tokens.delete({
                where: {
                    access_token: token
                },
            });

            return {
                message: 'Successfully signed out.'
            }
        } catch (error) {
            console.log(error);
            return 'Sign out error'
        }
    }

    private getRoleFromString(roleString: string): role {
        if (Object.values(role).includes(roleString as role)) {
            return roleString as role;
        }
        throw new Error("Invalid Role");
    }

    private generateJwtToken(user: users): string {
        return jwt.sign(
            {user},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
    }

    private generateRefreshToken(user: users): string {
        return jwt.sign(
            {user},
            process.env.REFRESH_JWT_SECRET,
            {expiresIn: '1h'}
        );
    }
}

