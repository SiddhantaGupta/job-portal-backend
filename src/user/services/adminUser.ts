import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryContract } from '../repositories';
import { UserModuleConstants } from '../constants';
import { ResumeRepositoryContract } from '../repositories/resume/contract';
import { BaseValidator } from '@libs/boat/validator';
import { UserIdDto } from '../dtos/userId';
import { GenericException } from '@libs/boat';
import { IUserModel, IUserSearchModel } from '../interfaces';
import { IPagination } from '@app/job/interfaces';
import { Pagination } from '@libs/sq-obj';
import { ConfigService } from '@nestjs/config';
import { JobModuleConstants } from '@app/job/constants';
import { ApplicationRepositoryContract } from '@app/job/repositories';
import { CandidateJobsService } from '@app/job';
import { EmitEvent } from '@squareboat/nest-events';
import { AdminUpdatedUser } from '../events/adminUpdatedUser';
import { update } from 'lodash';

@Injectable()
export class AdminUserService {
  constructor(
    private validator: BaseValidator,
    @Inject(UserModuleConstants.userRepo) public repo: UserRepositoryContract,
    @Inject(UserModuleConstants.resumeRepo)
    public resumeRepo: ResumeRepositoryContract,
    private config: ConfigService,
  ) {}

  async getUsers(payload: IUserSearchModel): Promise<Pagination<IUserModel>> {
    return this.repo.search(payload);
  }

  async getUserById(payload: UserIdDto): Promise<IUserModel> {
    const validatedInputs = await this.validator.fire(payload, UserIdDto);

    return this.repo.firstWhere({
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

    EmitEvent(new AdminUpdatedUser(updatedUser));

    if (!updatedUser) {
      throw new GenericException();
    }

    return updatedUser;
  }
}
