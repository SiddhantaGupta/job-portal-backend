import { BaseModel } from '@squareboat/nestjs-objection';

export class JobModel extends BaseModel {
  static tableName = 'jobs';
}
