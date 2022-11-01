import { IUserModel } from '@app/user/interfaces';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface UserRepositoryContract extends RepositoryContract<IUserModel> {}
