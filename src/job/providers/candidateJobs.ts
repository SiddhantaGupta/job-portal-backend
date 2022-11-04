import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { CandidateGetJobFilterDto, JobIdDto } from '../dtos';
import { uuid } from 'uuidv4';
import { ApplicationDto } from '../dtos/application';
import {
  IApplicationModel,
  IApplicationSearchModel,
  IJobModel,
  IPagination,
} from '../interfaces';
import { IUserModel } from '@app/user/interfaces';
import { pick } from 'lodash';
import { Pagination } from '@squareboat/nestjs-objection';

@Injectable()
export class CandidateJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async getJobs(
    payload: CandidateGetJobFilterDto,
    user: IUserModel,
  ): Promise<Pagination<IJobModel>> {
    const validatedInputs = await this.validator.fire(
      payload,
      CandidateGetJobFilterDto,
    );

    validatedInputs.isActive = true;

    console.log(validatedInputs);

    return this.repo.search(validatedInputs);
  }

  async getApplications(
    payload: IApplicationSearchModel,
    user: IUserModel,
  ): Promise<Pagination<IApplicationModel>> {
    payload.userId = user.id;
    return this.applicationRepo.search(payload);
  }

  async getJobById(payload: JobIdDto, user: IUserModel): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    let job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    if (!job.isActive) {
      throw new ForbiddenException('Job has been disabled');
    }

    return job;
  }

  async applyToJob(
    payload: ApplicationDto,
    user: IUserModel,
  ): Promise<IApplicationModel> {
    const validatedInputs = await this.validator.fire(payload, ApplicationDto);

    let job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    const applicationExists = await this.applicationRepo.exists({
      userId: user.id,
      jobId: job.id,
    });

    if (applicationExists) {
      throw new ConflictException('application already exists');
    }

    return await this.applicationRepo.create({
      uuid: uuid(),
      userId: user.id,
      jobId: job.id,
    });
  }
}
