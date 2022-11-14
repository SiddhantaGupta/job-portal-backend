import { BaseModel } from '@libs/sq-obj';
import { Model } from 'objection';
import path from 'path';

export class JobModel extends BaseModel {
  static tableName = 'jobs';

  static relationMappings = {
    applications: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'application'),
      join: {
        from: 'jobs.id',
        to: 'applications.jobId',
      },
    },
  };
}
