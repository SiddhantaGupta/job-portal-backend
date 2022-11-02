import { Controller, Get, Patch, Req } from '@nestjs/common';
import { AdminUserService } from '../services/adminUser';
import { Request } from '@libs/boat';
import { Auth } from '@app/auth/decorators/auth';

@Auth('admin')
@Controller('admin/users')
export class AdminUserController {
  constructor(private adminUserService: AdminUserService) {}

  @Get('')
  async users(@Req() req: Request) {
    return await this.adminUserService.users(req.all(), req.user);
  }

  @Get(':id')
  async user(@Req() req: Request) {
    return await this.adminUserService.user(req.all(), req.user);
  }

  @Patch(':id')
  async disableUser(@Req() req: Request) {
    return await this.adminUserService.updateUserStatus(req.all(), req.user);
  }
}
