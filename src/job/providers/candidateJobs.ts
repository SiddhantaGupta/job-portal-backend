import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { CandidateGetJobFilterDto, GetOneJobDto } from '../dtos';
import { uuid } from 'uuidv4';
import { ApplicationDto } from '../dtos/application';

@Injectable()
export class CandidateJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async jobs(payload: any, user: any) {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.all();
    }

    const validatedInputs = await this.validator.fire(
      payload,
      CandidateGetJobFilterDto,
    );

    return await this.repo.getWhere({
      ...validatedInputs,
    });
  }

  async applications(payload: any, user: any) {
    return await this.applicationRepo.getWhere({
      userId: user.id,
    });
  }

  async job(payload: any, user: any) {
    const validatedInputs = await this.validator.fire(payload, GetOneJobDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async apply(payload: any, user: any) {
    console.log(payload);
    const validatedInputs = await this.validator.fire(payload, ApplicationDto);

    let job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    return await this.applicationRepo.create({
      uuid: uuid(),
      userId: user.id,
      jobId: job.id,
    });
  }
}
