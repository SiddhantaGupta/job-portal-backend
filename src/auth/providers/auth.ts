import { ResumeService, UserService } from "@app/user";
import settings from "@config/settings";
import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {

    roles: any;

    constructor(
       private readonly userService: UserService,
       private readonly  resumeService: ResumeService
    ) {
        this.roles = settings().roles
    }

    async signup(payload: any) {

        payload.user.password = await bcrypt.hash(payload.user.password, 10);
        
        const user = await this.userService.users.query().insert({
            ...payload.user
        })

        if ( payload.user.role === this.roles.candidate ) {
            const resume = await this.resumeService.resume.query().insert({
                ...payload.resume
            })
        }
        
    }

    async login(payload: any) {

    }
    
}