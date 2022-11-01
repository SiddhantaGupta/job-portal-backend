import { BaseValidator } from '@libs/boat/validator';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JobModuleConstants } from '../constants';
import { JobRepositoryContract } from '../repositories';

@Injectable()
export class AdminJobsService {
  constructor(
    private validator: BaseValidator,
    private config: ConfigService,
    @Inject(JobModuleConstants.jobRepo) public repo: JobRepositoryContract,
  ) {}

  async Jobs(payload: any) {
    throw new Error('Method not implemented.');
  }

  async Job(payload: any) {
    throw new Error('Method not implemented.');
  }

  async disableJob(payload: any) {
    throw new Error('Method not implemented.');
  }

  async applications(payload: any) {
    throw new Error('Method not implemented.');
  }
}
