import { Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { Request } from '@libs/boat';
import { AdminJobsService } from '@app/job/providers';

@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private adminJobsService: AdminJobsService) {}

  @Get('')
  async Jobs(@Req() req: Request) {
    return await this.adminJobsService.Jobs(req.all());
  }

  @Get(':id')
  async Job(@Req() req: Request) {
    return await this.adminJobsService.Job(req.all());
  }

  @Patch(':id')
  async disableJob(@Req() req: Request) {
    return await this.adminJobsService.disableJob(req.all());
  }

  @Get('applications')
  async applications(@Req() req: Request) {
    return await this.adminJobsService.applications(req.all());
  }
}
