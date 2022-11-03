import { AuthService } from '@app/auth/providers/auth';
import { UserDetailTransformer } from '@app/transformer';
import { Request, RestController, Response } from '@libs/boat';
import { Controller, Get, Post, Req, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController extends RestController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('signup')
  async signup(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const accessToken = await this.authService.signup(req.all());
    return res.success(
      await this.transform(accessToken, new UserDetailTransformer(), { req }),
    );
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const accessToken = await this.authService.login(req.all());
    return res.success(
      await this.transform(accessToken, new UserDetailTransformer(), { req }),
    );
  }

  @Post('forgot-password')
  async forgotPassword(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    let otp = await this.authService.forgotPassword(req.all());
    return res.success(
      await this.transform(otp, new UserDetailTransformer(), { req }),
    );
  }

  @Post('reset-password')
  async resetPassword(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.resetPassword(req.all());
    return res.noContent();
  }
}
