import { BaseValidator, validate } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { JobPostDto, JobIdDto } from '../dtos';
import { uuid } from 'uuidv4';
import { IApplicationModel, IJobModel, IPagination } from '../interfaces';
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

  async getJobs(payload: IPagination, user: IUserModel): Promise<IJobModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.getWhere({
        postedBy: user.id,
        isActive: true,
      });
    }

    let jobsPaginatedSearch = await this.repo
      .query()
      .where({
        postedBy: user.id,
        isActive: true,
      })
      .page(payload.page, payload.perPage);

    return jobsPaginatedSearch.results;
  }

  async postJob(payload: JobPostDto, user: IUserModel): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobPostDto);

    const post = await this.repo.create({
      uuid: uuid(),
      postedBy: user.id,
      isActive: true,
      ...validatedInputs,
    });

    return post;
  }

  async getJobById(payload: JobIdDto, user: IUserModel): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async getApplicationsForJob(
    payload: IPagination,
    user: IUserModel,
  ): Promise<IApplicationModel[]> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    const job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    if (payload.page >= 0 && payload.perPage >= 0) {
      const applicationsPaginatedSearch = await this.applicationRepo
        .query()
        .where({
          jobId: job.id,
        })
        .page(payload.page, payload.perPage);

      return applicationsPaginatedSearch.results;
    }

    return await this.applicationRepo.getWhere({
      jobId: job.id,
    });
  }
}
