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
import { CandidateGetJobFilterDto, GetOneJobDto } from '../dtos';
import { uuid } from 'uuidv4';
import { ApplicationDto } from '../dtos/application';
import { IApplicationModel, IJobModel } from '../interfaces';

@Injectable()
export class CandidateJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async jobs(payload: any, user: any): Promise<IJobModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.all();
    }

    const validatedInputs = await this.validator.fire(
      payload,
      CandidateGetJobFilterDto,
    );

    return await this.repo.getWhere({
      ...validatedInputs,
      isActive: true,
    });
  }

  async applications(payload: any, user: any): Promise<IApplicationModel[]> {
    return await this.applicationRepo.getWhere({
      userId: user.id,
    });
  }

  async job(payload: any, user: any): Promise<IJobModel> {
    const validatedInputs = await this.validator.fire(payload, GetOneJobDto);

    let job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    if (!job.isActive) {
      throw new ForbiddenException('Job has been disabled');
    }

    return job;
  }

  async apply(payload: any, user: any): Promise<IApplicationModel> {
    console.log(payload);
    const validatedInputs = await this.validator.fire(payload, ApplicationDto);

    let job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    const applicationExists = this.applicationRepo.exists({
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
