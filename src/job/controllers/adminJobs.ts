import { Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { Request } from '@libs/boat';
import { AdminJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';

@Auth('admin')
@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private adminJobsService: AdminJobsService) {}

  @Get('')
  async jobs(@Req() req: Request) {
    return await this.adminJobsService.jobs(req.all(), req.user);
  }

  @Get('applications')
  async applications(@Req() req: Request) {
    return await this.adminJobsService.applications(req.all(), req.user);
  }

  @Get(':id')
  async job(@Req() req: Request) {
    return await this.adminJobsService.job(req.all(), req.user);
  }

  @Patch(':id')
  async disableJob(@Req() req: Request) {
    return await this.adminJobsService.disableJob(req.all(), req.user);
  }
}
