import { Job } from '@libs/sq-nest-queue';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobModuleConstants } from '../constants';
import { CandidateJobsService } from '../providers';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';

@Injectable()
export class UserUpdateService {
  constructor(
    private config: ConfigService,
    private readonly candidateJobService: CandidateJobsService,
  ) {}
  @Job('USER_UPDATED')
  async updateUserData(data: Record<string, any>) {
    const user = data;
    const userRoles = this.config.get('settings.roles');
    if (user.role === userRoles.recruiter) {
      await this.candidateJobService.repo.updateAndReturn(
        {
          postedBy: user.id,
        },
        {
          isActive: user.isActive,
        },
      );
    } else if (user.role === userRoles.candidate) {
      await this.candidateJobService.applicationRepo.updateAndReturn(
        {
          id: user.id,
        },
        {
          isActive: user.isActive,
        },
      );
    }
  }
}
