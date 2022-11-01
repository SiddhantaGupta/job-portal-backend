import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from '@libs/boat';
import { CandidateJobsService } from '@app/job/providers';

@Controller('candidate/jobs')
export class CandidateJobsController {
  constructor(private candidateJobsService: CandidateJobsService) {}

  @Get('')
  async Jobs(@Req() req: Request) {
    return await this.candidateJobsService.Jobs(req.all());
  }

  @Get(':id')
  async Job(@Req() req: Request) {
    return await this.candidateJobsService.Job(req.all());
  }

  @Post(':id/apply')
  async apply(@Req() req: Request) {
    return await this.candidateJobsService.apply(req.all());
  }

  @Post('applications')
  async applications(@Req() req: Request) {
    return await this.candidateJobsService.applications(req.all());
  }
}
