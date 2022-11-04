import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { ApplicationIdDto, JobIdDto } from '../dtos';
import { GenericException, Pagination } from '@libs/boat';
import {
  IApplicationModel,
  IApplicationSearchModel,
  IJobModel,
  IJobSearchModel,
  IPagination,
} from '../interfaces';

@Injectable()
export class AdminJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async getJobs(payload: IJobSearchModel): Promise<Pagination<IJobModel>> {
    return await this.repo.search(payload);
  }
  async getApplications(
    payload: IApplicationSearchModel,
  ): Promise<Pagination<IApplicationModel>> {
    return this.applicationRepo.search(payload);
  }

  async getApplicationById(
    payload: ApplicationIdDto,
  ): Promise<IApplicationModel> {
    const validatedInputs = await this.validator.fire(
      payload,
      ApplicationIdDto,
    );

    return await this.applicationRepo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async getJobById(payload: JobIdDto): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async updateJobStatus(payload: JobIdDto): Promise<IJobModel | IJobModel[]> {
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
