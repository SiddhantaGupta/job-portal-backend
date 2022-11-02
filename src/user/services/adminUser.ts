import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { UserModuleConstants } from '../constants';
import { ResumeRepositoryContract } from '../repositories/resume/contract';
import { BaseValidator } from '@libs/boat/validator';
import { UserIdDto } from '../dtos/userId';
import { GenericException } from '@libs/boat';

@Injectable()
export class AdminUserService {
  constructor(
    private validator: BaseValidator,
    @Inject(UserModuleConstants.userRepo) public repo: UserRepositoryContract,
    @Inject(UserModuleConstants.resumeRepo)
    public resumeRepo: ResumeRepositoryContract,
  ) {}

  async users(payload: any, user: any) {
    return await this.repo.all();
  }

  async user(payload: any, user: any) {
    const validatedInputs = await this.validator.fire(payload, UserIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async updateUserStatus(payload: any, user: any) {
    const validatedInputs = await this.validator.fire(payload, UserIdDto);

    let fetchedUser = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    let userUpdated = await this.repo.updateWhere(
      {
        uuid: validatedInputs.id,
      },
      {
        isActive: !fetchedUser.isActive,
      },
    );

    if (!userUpdated) {
      throw new GenericException();
    }

    return {
      success: true,
      message: `User status has been set to ${!fetchedUser.isActive}`,
    };
  }
}
