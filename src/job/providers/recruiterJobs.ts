import { BaseValidator, validate } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import {
  JobPostDto,
  JobIdDto,
  PaginationDto,
  RecruiterJobApplicationsDto,
} from '../dtos';
import { uuid } from 'uuidv4';
import { IApplicationModel, IJobModel } from '../interfaces';
import { IUserModel } from '@app/user/interfaces';

@Injectable()
export class RecruiterJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async jobs(
    payload: Record<string, any>,
    user: IUserModel,
  ): Promise<IJobModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.getWhere({
        postedBy: user.id,
        isActive: true,
      });
    }

    const validatedInputs = await this.validator.fire(payload, PaginationDto);

    let jobsPaginatedSearch = await this.repo
      .query()
      .where({
        postedBy: user.id,
        isActive: true,
      })
      .page(validatedInputs.page, validatedInputs.items);

    return jobsPaginatedSearch.results;
  }

  async postJob(
    payload: Record<string, any>,
    user: IUserModel,
  ): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobPostDto);

    const post = await this.repo.create({
      uuid: uuid(),
      postedBy: user.id,
      isActive: true,
      ...validatedInputs,
    });

    return post;
  }

  async job(
    payload: Record<string, any>,
    user: IUserModel,
  ): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async applications(
    payload: Record<string, any>,
    user: IUserModel,
  ): Promise<IApplicationModel[]> {
    const validatedInputs = await this.validator.fire(
      payload,
      RecruiterJobApplicationsDto,
    );

    const job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    if (validatedInputs.page >= 0 && validatedInputs.items >= 0) {
      const applicationsPaginatedSearch = await this.applicationRepo
        .query()
        .where({
          jobId: job.id,
        })
        .page(validatedInputs.page, validatedInputs.items);

      return applicationsPaginatedSearch.results;
    }

    return await this.applicationRepo.getWhere({
      jobId: job.id,
    });
  }
}
