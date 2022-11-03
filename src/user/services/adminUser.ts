import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { UserModuleConstants } from '../constants';
import { ResumeRepositoryContract } from '../repositories/resume/contract';
import { BaseValidator } from '@libs/boat/validator';
import { UserIdDto } from '../dtos/userId';
import { GenericException } from '@libs/boat';
import { IUserModel } from '../interfaces';
import { PaginationDto } from '@app/job/dtos';

@Injectable()
export class AdminUserService {
  constructor(
    private validator: BaseValidator,
    @Inject(UserModuleConstants.userRepo) public repo: UserRepositoryContract,
    @Inject(UserModuleConstants.resumeRepo)
    public resumeRepo: ResumeRepositoryContract,
  ) {}

  async users(payload: Record<string, any>): Promise<IUserModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.all();
    }

    const validatedInputs = await this.validator.fire(payload, PaginationDto);

    const usersPaginatedSearch = await this.repo
      .query()
      .page(validatedInputs.page, validatedInputs.items);

    return usersPaginatedSearch.results;
  }

  async user(payload: Record<string, any>): Promise<IUserModel> {
    const validatedInputs = await this.validator.fire(payload, UserIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async updateUserStatus(
    payload: Record<string, any>,
  ): Promise<IUserModel | IUserModel[]> {
    const validatedInputs = await this.validator.fire(payload, UserIdDto);

    let fetchedUser = await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });

    let updatedUser = await this.repo.updateAndReturn(
      {
        uuid: validatedInputs.id,
      },
      {
        isActive: !fetchedUser.isActive,
      },
      true,
    );

    if (!updatedUser) {
      throw new GenericException();
    }

    return updatedUser;
  }
}
