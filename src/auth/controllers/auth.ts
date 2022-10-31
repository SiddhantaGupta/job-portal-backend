import { AuthService } from "@app/auth/providers/auth";
import { Request, Response } from "@libs/boat";
import { Controller, Get, Post, Req, Res } from "@nestjs/common";

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    async signup(@Req() req: Request) {
        const payload = req.all();
        return await this.authService.signup(payload)
    }

    @Post('login')
    async login(@Req() req: Request) {
        const payload = req.all();
        return await this.authService.login(payload)
    }
}