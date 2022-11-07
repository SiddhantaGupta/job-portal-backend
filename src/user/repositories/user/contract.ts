import { IUserModel, IUserSearchModel } from '@app/user/interfaces';
import { Pagination, RepositoryContract } from '@libs/sq-obj';

export interface UserRepositoryContract extends RepositoryContract<IUserModel> {
  search(inputs: IUserSearchModel): Promise<Pagination<IUserModel>>;
}
