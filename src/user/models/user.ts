import { BaseModel } from '@libs/sq-obj';
import { Model } from 'objection';
import { ResumeModel } from './resume';

export class UserModel extends BaseModel {
  static tableName = 'users';

  static relationMappings = {
    resume: {
      relation: Model.HasOneRelation,
      modelClass: ResumeModel,
      join: {
        from: 'users.id',
        to: 'resumes.userId',
      },
    },
  };
}
