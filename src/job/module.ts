import { UserModule } from '@app/user';
import { BaseValidator } from '@libs/boat/validator';
import { Module } from '@nestjs/common';
import { JobModuleConstants } from './constants';
import {
  AdminJobsController,
  CandidateJobsController,
  RecruiterJobsController,
} from './controllers';
import { JobModuleListener } from './listeners/jobModuleListener';
import {
  AdminJobsService,
  CandidateJobsService,
  RecruiterJobsService,
} from './providers';
import { JobUpdateService } from './queue/jobDataUpdate';
import { UserUpdateService } from './queue/userDataUpdate';
import { JobRepository, ApplicationRepository } from './repositories';

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
    {
      provide: JobModuleConstants.applicationRepo,
      useClass: ApplicationRepository,
    },
    UserUpdateService,
    JobModuleListener,
    JobUpdateService,
  ],
  exports: [],
})
export class JobModule {}
