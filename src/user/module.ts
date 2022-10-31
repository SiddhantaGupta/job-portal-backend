import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { UserModuleConstants } from './constants';
import { UserRepository } from './repositories';
import { GreetUser } from './commands';
import { ResumeRepository } from './repositories/resume/database';
import { ResumeService } from './services';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    ResumeService,
    GreetUser,
    { provide: UserModuleConstants.userRepo, useClass: UserRepository },
    { provide: UserModuleConstants.resumeRepo, useClass: ResumeRepository },
  ],
  exports:[
    UserService,
  ]
})
export class UserModule {}
