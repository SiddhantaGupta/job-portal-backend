import { UserModel } from '@app/user';
import { BaseModel } from '@squareboat/nestjs-objection';
import { Model } from 'objection';
import { JobModel } from './job';

export class ApplicationModel extends BaseModel {
  static tableName = 'applications';

  static relationMappings = {
    job: {
      relation: Model.BelongsToOneRelation,
      modelClass: JobModel,
      join: {
        from: 'jobs.id',
        to: 'applications.jobId',
      },
    },
    applicant: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'users.id',
        to: 'applications.userId',
      },
    },
  };
}
