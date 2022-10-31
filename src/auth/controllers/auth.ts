import { AuthService } from "@app/auth/providers/auth";
import { Request } from "@libs/boat";
import { Controller, Get, Post, Req } from "@nestjs/common";

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    async signup(@Req() req: Request) {
        return await this.authService.signup(req.all())
    }

    @Post('login')
    async login(@Req() req: Request) {
        return await this.authService.login(req.all());
    }

    @Post('forgot-password')
    async forgotPassword(@Req() req: Request) {
        return await this.authService.forgotPassword(req.all());
    }

    @Post('reset-password')
    async resetPassword(@Req() req: Request) {
        return await this.authService.resetPassword(req.all());
    }

}