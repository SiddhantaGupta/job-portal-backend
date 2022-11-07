import { Job } from '@libs/sq-nest-queue';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CandidateJobsService } from '../providers';

@Injectable()
export class JobUpdateService {
  constructor(
    private config: ConfigService,
    private readonly candidateJobService: CandidateJobsService,
  ) {}
  @Job('JOB_UPDATED')
  async updateApplicationData(data: Record<string, any>) {
    const job = data;
    this.candidateJobService.applicationRepo.updateAndReturn(
      {
        jobId: job.id,
      },
      {
        isActive: job.isActive,
      },
    );
  }
}
