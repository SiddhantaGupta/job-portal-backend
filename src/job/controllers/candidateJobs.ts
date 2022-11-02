import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from '@libs/boat';
import { CandidateJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';

@Auth('candidate')
@Controller('candidate/jobs')
export class CandidateJobsController {
  constructor(private candidateJobsService: CandidateJobsService) {}

  @Get('')
  async jobs(@Req() req: Request) {
    return await this.candidateJobsService.jobs(req.all(), req.user);
  }

  @Get('applications')
  async applications(@Req() req: Request) {
    return await this.candidateJobsService.applications(req.all(), req.user);
  }

  @Get(':id')
  async job(@Req() req: Request) {
    return await this.candidateJobsService.job(req.all(), req.user);
  }

  @Post(':id/apply')
  async apply(@Req() req: Request) {
    return await this.candidateJobsService.apply(req.all(), req.user);
  }
}
