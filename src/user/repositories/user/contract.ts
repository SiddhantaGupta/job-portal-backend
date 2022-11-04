import { IUserModel, IUserSearchModel } from '@app/user/interfaces';
import { Pagination, RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserRepositoryContract extends RepositoryContract<IUserModel> {
  search(inputs: IUserSearchModel): Promise<Pagination<IUserModel>>;
}
