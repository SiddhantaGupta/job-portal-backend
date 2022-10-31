import { ResumeService, UserService } from "@app/user";
import settings from "@config/settings";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';

@Injectable()
export class AuthService {

    roles: any;

    constructor(
       private readonly userService: UserService,
       private readonly  resumeService: ResumeService,
       private config: ConfigService,
       private jwt: JwtService
    ) {
        this.roles = settings().roles
    }

    async signup(payload: any) {

        payload.user.password = await bcrypt.hash(payload.user.password, 10);
        
        const user = await this.userService.users.query().insert({
            uuid: crypto.randomUUID(),
            ...payload.user,
            is_active: true
        })

        if ( payload.user.role === this.roles.candidate ) {
            const resume = await this.resumeService.resume.query().insert({
                ...payload.resume
            })
        }

        return user;
        
    }

    async login(payload: any) {

        const user = await this.userService.users.query().findOne({
            email_id: payload.email_id
        })

        let result
        if ( user ) {
            result = await bcrypt.compare(payload.password, user.password)
        }

        if ( !result ) {
            throw new ForbiddenException(
                'Credentials Incorrect'
            )
        }

        return await this.signToken( user.uuid )
    }

    async signToken(
        uuid: string
      ): Promise<{ access_token: string }> {
        const payload = {
          uuid: uuid
        };
        const secret = this.config.get('JWT_SECRET');
    
        const token = await this.jwt.signAsync(
          payload,
          {
            expiresIn: '120m',
            secret: secret,
          },
        );
    
        return {
          access_token: token,
        };
      }
    
}