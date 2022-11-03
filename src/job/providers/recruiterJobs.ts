import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import {
  ApplicationRepositoryContract,
  JobRepositoryContract,
} from '../repositories';
import { GetOneJobDto, JobPostDto, JobIdDto } from '../dtos';
import { uuid } from 'uuidv4';

@Injectable()
export class RecruiterJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
    @Inject(JobModuleConstants.applicationRepo)
    public applicationRepo: ApplicationRepositoryContract,
  ) {}

  async jobs(payload: any, user: any) {
    return await this.repo.getWhere({
      postedBy: user.id,
      isActive: true,
    });
  }

  async postJob(
    payload: any,
    user: any,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const validatedInputs = await this.validator.fire(payload, JobPostDto);

    const post = await this.repo.create({
      uuid: uuid(),
      postedBy: user.id,
      isActive: true,
      ...validatedInputs,
    });

    return {
      success: true,
      message: 'Job posted successfully!',
    };
  }

  async job(payload: any, user: any) {
    const validatedInputs = await this.validator.fire(payload, GetOneJobDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async applications(payload: any, user: any) {
    const validatedInputs = await this.validator.fire(payload, JobIdDto);

    const job = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    return await this.applicationRepo.getWhere({
      jobId: job.id,
    });
  }
}
