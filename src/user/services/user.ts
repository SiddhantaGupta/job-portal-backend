import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { ListensTo } from '@squareboat/nest-events';
import { UserSignedUp } from '../events/userSignedUp';
import { UserModuleConstants } from '../constants';
import { ResumeRepositoryContract } from '../repositories/resume/contract';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserModuleConstants.userRepo) public repo: UserRepositoryContract,
    @Inject(UserModuleConstants.resumeRepo) public resumeRepo: ResumeRepositoryContract,
  ) {}

  async get(): Promise<Record<string, any>> {
    return this.repo.firstWhere({});
  }

  @ListensTo('USER_SIGNED_UP')
  userSignedUp(event: UserSignedUp): void {
    console.log('EVENT RECEIVED ===>', event);
    // add your logic here
    return;
  }
}
