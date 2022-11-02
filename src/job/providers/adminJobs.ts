import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { JobIdDto } from '../dtos';
import { GenericException } from '@libs/boat';

@Injectable()
export class AdminJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async jobs(payload: any, user: any) {
    return await this.repo.all();
  }
  async applications(payload: any, user: any) {
    return await this.applicationRepo.all();
  }

  async job(payload: any, user: any) {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async updateJobStatus(payload: any, user: any) {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    let job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    let patchedJob = await this.repo.updateWhere(
      {
        uuid: validatedInputs.id,
      },
      {
        isActive: !job.isActive,
      },
    );

    if (!patchedJob) {
      throw new GenericException();
    }

    return {
      success: true,
      message: `Job status has been set to ${!job.isActive}`,
    };
  }
}
