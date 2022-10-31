import { Request } from "@libs/boat";
import { Controller, Get, Post, Req } from "@nestjs/common";
import { AdminAuthService } from "../providers/adminAuth";

@Controller('admin/auth')
export class AdminAuthController {

    constructor(
        private adminAuthService: AdminAuthService
    ) {}

    @Post('login')
    async login(@Req() req: Request) {
        return await this.adminAuthService.login(req.all());
    }
}