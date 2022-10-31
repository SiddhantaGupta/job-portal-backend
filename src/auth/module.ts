import { UserModule } from "@app/user";
import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth";
import { AuthService } from "./providers/auth";

@Module({
    imports: [
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {

}