import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import { JobRepositoryContract } from '../repositories';

@Injectable()
export class RecruiterJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
  ) {}

  async job(payload: any) {
    throw new Error('Method not implemented.');
  }

  async jobs(payload: any) {
    throw new Error('Method not implemented.');
  }

  async postJob(payload: any) {
    throw new Error('Method not implemented.');
  }

  async applications(payload: any) {
    throw new Error('Method not implemented.');
  }
}
