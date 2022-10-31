import { UserModule } from "@app/user";
import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth";
import { AuthService } from "./providers/auth";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "./strategy/jwt";
import { BaseValidator } from "@libs/boat/validator";

@Module({
    imports: [
        UserModule,
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        BaseValidator
    ]
})
export class AuthModule {

}