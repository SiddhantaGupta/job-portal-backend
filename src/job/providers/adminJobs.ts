import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { ApplicationIdDto, JobIdDto } from '../dtos';
import { GenericException } from '@libs/boat';
import { IApplicationModel, IJobModel, IPagination } from '../interfaces';

@Injectable()
export class AdminJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async getJobs(payload: IPagination): Promise<IJobModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.all();
    }

    let jobPaginatedSearch = await this.repo
      .query()
      .page(payload.page, payload.perPage);

    return jobPaginatedSearch.results;
  }
  async getApplications(payload: IPagination): Promise<IApplicationModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.applicationRepo.all();
    }

    let applicationPaginatedSearch = await this.applicationRepo
      .query()
      .page(payload.page, payload.perPage);

    return applicationPaginatedSearch.results;
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
