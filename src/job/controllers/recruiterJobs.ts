import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from '@libs/boat';
import { RecruiterJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';
import { UserModel } from '@app/user';

@Auth('recruiter')
@Controller('recruiter/jobs')
export class RecruiterJobsController {
  constructor(private recruiterJobsService: RecruiterJobsService) {}

  @Get('')
  async jobs(@Req() req: Request) {
    return await this.recruiterJobsService.jobs(req.all(), req.user);
  }

  @Post('')
  async postJob(@Req() req: Request) {
    return await this.recruiterJobsService.postJob(req.all(), req.user);
  }

  @Get(':id')
  async job(@Req() req: Request) {
    return await this.recruiterJobsService.job(req.all(), req.user);
  }

  @Get(':id/applications')
  async applications(@Req() req: Request) {
    return await this.recruiterJobsService.applications(req.all(), req.user);
  }
}
