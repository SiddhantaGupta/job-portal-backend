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
import { CandidateGetJobFilterDto, JobIdDto, PaginationDto } from '../dtos';
import { uuid } from 'uuidv4';
import { ApplicationDto } from '../dtos/application';
import { IApplicationModel, IJobModel } from '../interfaces';
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

  async jobs(
    payload: Record<string, any>,
    user: IUserModel,
  ): Promise<IJobModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.all();
    }

    const validatedInputs = await this.validator.fire(
      payload,
      CandidateGetJobFilterDto,
    );
    const filters = pick(validatedInputs, ['title', 'location']);

    if (validatedInputs.page >= 0 && validatedInputs.items >= 0) {
      let jobsPaginatedSearch = await this.repo
        .query()
        .where({
          ...filters,
          isActive: true,
        })
        .page(validatedInputs.page, validatedInputs.items);

      return jobsPaginatedSearch.results;
    }

    return await this.repo.getWhere({
      ...filters,
      isActive: true,
    });
  }

  async applications(
    payload: Record<string, any>,
    user: IUserModel,
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

  async job(
    payload: Record<string, any>,
    user: IUserModel,
  ): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    let job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    if (!job.isActive) {
      throw new ForbiddenException('Job has been disabled');
    }

    return job;
  }

  async apply(
    payload: Record<string, any>,
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
