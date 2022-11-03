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
import { IApplicationModel, IJobModel, IPagination } from '../interfaces';
import { IUserModel } from '@app/user/interfaces';
import { pick } from 'lodash';

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
  ): Promise<IJobModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.all();
    }

    const validatedInputs = await this.validator.fire(
      payload,
      CandidateGetJobFilterDto,
    );

    if (payload.page >= 0 && payload.perPage >= 0) {
      let jobsPaginatedSearch = await this.repo
        .query()
        .where({
          ...validatedInputs,
          isActive: true,
        })
        .page(payload.page, payload.perPage);

      return jobsPaginatedSearch.results;
    }

    return await this.repo.getWhere({
      ...validatedInputs,
      isActive: true,
    });
  }

  async getApplications(
    payload: IPagination,
    user: IUserModel,
  ): Promise<IApplicationModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.applicationRepo.getWhere({
        userId: user.id,
      });
    }

    let applicationPaginatedSearch = await this.applicationRepo
      .query()
      .page(payload.page, payload.perPage);

    return applicationPaginatedSearch.results;
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
