import { UserDetailTransformer } from '@app/transformer';
import { IUserModel } from '@app/user/interfaces';
import { Request, Response, RestController } from '@libs/boat';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { AdminLoginDto } from '../dtos';
import { AdminAuthService } from '../providers/adminAuth';

@Controller('admin/auth')
export class AdminAuthController extends RestController {
  constructor(private adminAuthService: AdminAuthService) {
    super();
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response): Promise<IUserModel> {
    let authToken = await this.adminAuthService.login(
      req.all() as AdminLoginDto,
    );
    return res.success(
      await this.transform(authToken, new UserDetailTransformer(), { req }),
    );
  }
}
