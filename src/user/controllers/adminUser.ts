import { Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { AdminUserService } from '../services/adminUser';
import { Request, Response, RestController } from '@libs/boat';
import { Auth } from '@app/auth/decorators/auth';
import { UserDetailTransformer } from '@app/transformer';
import { IPagination } from '@app/job/interfaces';
import { UserIdDto } from '../dtos/userId';
import { IUserSearchModel } from '../interfaces';

@Auth('admin')
@Controller('admin/users')
export class AdminUserController extends RestController {
  constructor(private adminUserService: AdminUserService) {
    super();
  }

  @Get('')
  async getUsers(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const users = await this.adminUserService.getUsers(
      req.all() as IUserSearchModel,
    );
    return res.withMeta(
      await this.paginate(users, new UserDetailTransformer(), { req }),
    );
  }

  @Get(':id')
  async getUserById(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    let user = await this.adminUserService.getUserById(req.all() as UserIdDto);
    return res.success(
      await this.transform(user, new UserDetailTransformer(), { req }),
    );
  }

  @Patch(':id')
  async updateUserStatus(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    let updatedUser = await this.adminUserService.updateUserStatus(
      req.all() as UserIdDto,
    );
    return res.success(
      await this.transform(updatedUser, new UserDetailTransformer(), { req }),
    );
  }
}
