import { Injectable } from '@nestjs/common';
import { UserRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';
import { IUserModel } from '@app/user/interfaces';
import { UserModel } from '@app/user/models';

@Injectable()
export class UserRepository
  extends DatabaseRepository<IUserModel>
  implements UserRepositoryContract
{
  @InjectModel(UserModel)
  model: UserModel;
}
