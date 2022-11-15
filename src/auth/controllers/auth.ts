import { AuthService } from '@app/auth/providers/auth';
import { UserDetailTransformer } from '@app/transformer';
import { Request, RestController, Response } from '@libs/boat';
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import {
  CandidateSignupDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
} from '../dtos';

@Controller('auth')
export class AuthController extends RestController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('signup')
  async signup(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const accessToken = await this.authService.signup(
      req.all() as SignupDto | CandidateSignupDto,
    );
    return res.success(
      await this.transform(accessToken, new UserDetailTransformer(), { req }),
      201,
    );
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const accessToken = await this.authService.login(req.all() as LoginDto);
    return res.success(
      await this.transform(accessToken, new UserDetailTransformer(), { req }),
    );
  }

  @Post('forgot-password')
  async forgotPassword(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return res.success(
      await this.authService.forgotPassword(req.all() as ForgotPasswordDto),
    );
  }

  @Post('reset-password')
  async resetPassword(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return res.success(
      await this.authService.resetPassword(req.all() as ResetPasswordDto),
    );
  }
}
