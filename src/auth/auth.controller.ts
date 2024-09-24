import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UnauthorizedException,
    UseGuards,
    Req,
    Get,
    Request
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignInDto} from "./dto/signInDto";
import {SignUpDto} from "./dto/signUpDto";
import {JwtAuthGuard} from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }


    @Post('sign-up')
    @UseGuards(JwtAuthGuard)
    async signUp(
        @Body() signUpDto: SignUpDto,
    ) {
        return await this.authService.signup(signUpDto);
    }

    @Post('sign-in')
    async signIn(
        @Body() signInDto: SignInDto,
    ) {
        return await this.authService.signIn(signInDto);
    }

    @Post("sign-out")
    async signOut(@Request() req: Request) {
        try {
            return await this.authService.logout(req);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }


}
