import { BaseValidator, validate } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { JobPostDto, JobIdDto } from '../dtos';
import { uuid } from 'uuidv4';
import {
  IApplicationModel,
  IApplicationSearchModel,
  IJobModel,
  IJobSearchModel,
  IPagination,
} from '../interfaces';
import { IUserModel } from '@app/user/interfaces';
import { Pagination } from '@libs/sq-obj';

@Injectable()
export class RecruiterJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async getJobs(
    payload: IJobSearchModel,
    user: IUserModel,
  ): Promise<Pagination<IJobModel>> {
    payload.userId = user.id;
    payload.isActive = true;
    return this.repo.search(payload);
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

    const job = await this.repo.firstWhere(
      {
        postedBy: user.id,
        uuid: validatedInputs.id,
        isActive: true,
      },
      false,
    );

    if (!job) {
      throw new NotFoundException('No job found');
    }

    return job;
  }

  async getApplicationsForJob(
    payload: IApplicationSearchModel,
    user: IUserModel,
  ): Promise<Pagination<IApplicationModel>> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    const job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    payload.jobId = job.id;

    return this.applicationRepo.search(payload);
  }
}
