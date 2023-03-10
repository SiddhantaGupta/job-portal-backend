import { Module } from '@nestjs/common';
import { AdminUserController, UserController } from './controllers';
import { AdminUserService, UserService } from './services';
import { UserModuleConstants } from './constants';
import { UserRepository } from './repositories';
import { CreateAdmin, GreetUser } from './commands';
import { ResumeRepository } from './repositories/resume/database';
import { ResumeService } from './services';
import { BaseValidator } from '@libs/boat/validator';
import { CandidateJobsService, JobModule } from '@app/job';
import { UserModuleListener } from './listeners/userModuleListeners';

@Module({
  imports: [],
  controllers: [UserController, AdminUserController],
  providers: [
    UserService,
    AdminUserService,
    ResumeService,
    BaseValidator,
    GreetUser,
    CreateAdmin,
    UserModuleListener,
    { provide: UserModuleConstants.userRepo, useClass: UserRepository },
    { provide: UserModuleConstants.resumeRepo, useClass: ResumeRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
