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
import { IApplicationModel, IJobModel } from '../interfaces';

@Injectable()
export class AdminJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async jobs(payload: any, user: any): Promise<IJobModel[]> {
    return await this.repo.all();
  }
  async applications(payload: any, user: any): Promise<IApplicationModel[]> {
    return await this.applicationRepo.all();
  }

  async application(payload: any, user: any): Promise<IApplicationModel> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    return await this.applicationRepo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async job(payload: any, user: any): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async updateJobStatus(
    payload: any,
    user: any,
  ): Promise<IJobModel | IJobModel[]> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    let job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    let patchedJob = await this.repo.updateAndReturn(
      {
        uuid: validatedInputs.id,
      },
      {
        isActive: !job.isActive,
      },
      true,
    );

    if (!patchedJob) {
      throw new GenericException();
    }

    return patchedJob;
  }
}
