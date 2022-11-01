import { UserModule } from '@app/user';
import { BaseValidator } from '@libs/boat/validator';
import { Module } from '@nestjs/common';
import { JobModuleConstants } from './constants';
import {
  AdminJobsController,
  CandidateJobsController,
  RecruiterJobsController,
} from './controllers';
import {
  AdminJobsService,
  CandidateJobsService,
  RecruiterJobsService,
} from './providers';
import { JobRepository } from './repositories';

@Module({
  imports: [UserModule],
  controllers: [
    AdminJobsController,
    CandidateJobsController,
    RecruiterJobsController,
  ],
  providers: [
    AdminJobsService,
    CandidateJobsService,
    RecruiterJobsService,
    BaseValidator,
    { provide: JobModuleConstants.jobRepo, useClass: JobRepository },
  ],
})
export class JobModule {}
