import { BaseModel } from '@squareboat/nestjs-objection';
import { Model } from 'objection';
import { UserModel } from './user';

export class ResumeModel extends BaseModel {
  static tableName = 'resumes';

  static relationMappings = {
    candidate: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'users.id',
        to: 'resumes.userId',
      },
    },
  };
}
