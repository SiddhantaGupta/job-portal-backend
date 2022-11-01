import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from '@libs/boat';
import { RecruiterJobsService } from '@app/job/providers';

@Controller('recruiter/jobs')
export class RecruiterJobsController {
  constructor(private recruiterJobsService: RecruiterJobsService) {}

  @Get('')
  async jobs(@Req() req: Request) {
    return await this.recruiterJobsService.jobs(req.all());
  }

  @Get(':id')
  async job(@Req() req: Request) {
    return await this.recruiterJobsService.job(req.all());
  }

  @Post('')
  async postJob(@Req() req: Request) {
    return await this.recruiterJobsService.postJob(req.all());
  }

  @Get(':id/applications')
  async applications(@Req() req: Request) {
    return await this.recruiterJobsService.applications(req.all());
  }
}
