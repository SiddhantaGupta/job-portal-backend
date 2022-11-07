import { Injectable } from '@nestjs/common';
import { UserRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel, Pagination } from '@libs/sq-obj';
import { IUserModel, IUserSearchModel } from '@app/user/interfaces';
import { UserModel } from '@app/user/models';

@Injectable()
export class UserRepository
  extends DatabaseRepository<IUserModel>
  implements UserRepositoryContract
{
  @InjectModel(UserModel)
  model: UserModel;

  async search(inputs: IUserSearchModel): Promise<Pagination<IUserModel>> {
    const searchResult: Pagination<IUserModel> = await this.query().paginate(
      inputs.page || 1,
      inputs.perPage || 15,
    );

    return searchResult;
  }
}
