import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { ApplicationIdDto, JobIdDto, PaginationDto } from '../dtos';
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

  async jobs(payload: Record<string, any>): Promise<IJobModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.all();
    }

    const validatedInputs = await this.validator.fire(payload, PaginationDto);

    let jobPaginatedSearch = await this.repo
      .query()
      .page(validatedInputs.page, validatedInputs.items);

    return jobPaginatedSearch.results;
  }
  async applications(
    payload: Record<string, any>,
  ): Promise<IApplicationModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.applicationRepo.all();
    }

    const validatedInputs = await this.validator.fire(payload, PaginationDto);

    let applicationPaginatedSearch = await this.applicationRepo
      .query()
      .page(validatedInputs.page, validatedInputs.items);

    return applicationPaginatedSearch.results;
  }

  async application(payload: Record<string, any>): Promise<IApplicationModel> {
    const validatedInputs = await this.validator.fire(
      payload,
      ApplicationIdDto,
    );

    return await this.applicationRepo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async job(payload: Record<string, any>): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async updateJobStatus(
    payload: Record<string, any>,
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
