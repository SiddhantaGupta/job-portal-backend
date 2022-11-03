import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { UserModuleConstants } from '../constants';
import { ResumeRepositoryContract } from '../repositories/resume/contract';
import { BaseValidator } from '@libs/boat/validator';
import { UserIdDto } from '../dtos/userId';
import { GenericException } from '@libs/boat';
import { IUserModel } from '../interfaces';
import { IPagination } from '@app/job/interfaces';

@Injectable()
export class AdminUserService {
  constructor(
    private validator: BaseValidator,
    @Inject(UserModuleConstants.userRepo) public repo: UserRepositoryContract,
    @Inject(UserModuleConstants.resumeRepo)
    public resumeRepo: ResumeRepositoryContract,
  ) {}

  async getUsers(payload: IPagination): Promise<IUserModel[]> {
    if (payload && Object.keys(payload).length === 0) {
      return await this.repo.all();
    }

    const usersPaginatedSearch = await this.repo
      .query()
      .page(payload.page, payload.perPage);

    return usersPaginatedSearch.results;
  }

  async getUserById(payload: UserIdDto): Promise<IUserModel> {
    const validatedInputs = await this.validator.fire(payload, UserIdDto);

    return await this.repo.firstWhere({
      uuid: validatedInputs.id,
    });
  }

  async updateUserStatus(
    payload: UserIdDto,
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
