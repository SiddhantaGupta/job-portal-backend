import { ResumeService, UserService } from "@app/user";
// import settings from "@config/settings";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import { BaseValidator } from "@libs/boat/validator";
import { LoginDto, ResumeDto, SignupDto } from "../dto";

@Injectable()
export class AuthService {

    roles: any;

    constructor(
       private readonly userService: UserService,
       private readonly  resumeService: ResumeService,
       private config: ConfigService,
       private jwt: JwtService,
       private validator: BaseValidator
    ) {
    }

    async signup(payload: any): Promise<SignupDto> {

        const validatedInputs = await this.validator.fire(payload.user, SignupDto)

        const userRoles = this.config.get('settings.roles')
        payload.user.password = await bcrypt.hash(payload.user.password, 10);
        
        const user = await this.userService.users.query().insert({
            uuid: crypto.randomUUID(),
            ...payload.user,
            is_active: true
        })

        if ( payload.user.role === userRoles.candidate ) {
            const validatedInputs = await this.validator.fire(payload.resume, ResumeDto)
            const resume = await this.resumeService.resume.query().insert({
                ...payload.resume
            })
        }

        return user;
        
    }

    async login(payload: any): Promise<{ accessToken: string }> {

        const validatedInputs = await this.validator.fire(payload, LoginDto)

        const user = await this.userService.users.query().findOne({
            email: payload.email
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
      ): Promise<{ accessToken: string }> {
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
          accessToken: token,
        };
      }
    
}