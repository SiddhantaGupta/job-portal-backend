import { Job } from '@libs/sq-nest-queue';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobModuleConstants } from '../constants';
import { IJobModel } from '../interfaces';
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
    console.log('user updated', data, user.role === userRoles.recruiter);
    if (user.role === userRoles.recruiter) {
      let updatedJobs = (await this.candidateJobService.repo.updateAndReturn(
        {
          postedBy: user.id,
        },
        {
          isActive: user.isActive,
        },
      )) as IJobModel[];
      for (let jobIndex = 0; jobIndex < updatedJobs.length; jobIndex++) {
        let updatedApplication =
          await this.candidateJobService.applicationRepo.updateAndReturn(
            {
              jobId: updatedJobs[jobIndex].id,
            },
            {
              isActive: updatedJobs[jobIndex].isActive,
            },
          );
        console.log(updatedApplication);
      }
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
