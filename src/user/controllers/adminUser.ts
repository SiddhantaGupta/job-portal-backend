import { Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { AdminUserService } from '../services/adminUser';
import { Request, Response, RestController } from '@libs/boat';
import { Auth } from '@app/auth/decorators/auth';
import { UserDetailTransformer } from '@app/transformer';

@Auth('admin')
@Controller('admin/users')
export class AdminUserController extends RestController {
  constructor(private adminUserService: AdminUserService) {
    super();
  }

  @Get('')
  async users(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const users = await this.adminUserService.users(req.all());
    return res.success(
      await this.collection(users, new UserDetailTransformer(), { req }),
    );
  }

  @Get(':id')
  async user(@Req() req: Request, @Res() res: Response): Promise<Response> {
    let user = await this.adminUserService.user(req.all());
    return res.success(
      await this.transform(user, new UserDetailTransformer(), { req }),
    );
  }

  @Patch(':id')
  async disableUser(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    let updatedUser = await this.adminUserService.updateUserStatus(req.all());
    return res.success(
      await this.transform(updatedUser, new UserDetailTransformer(), { req }),
    );
  }
}
