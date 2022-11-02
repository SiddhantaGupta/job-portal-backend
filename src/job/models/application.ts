import { BaseModel } from '@squareboat/nestjs-objection';

export class ApplicationModel extends BaseModel {
  static tableName = 'applications';
}
