import { BaseModel } from '@squareboat/nestjs-objection';

export interface IJobModel extends BaseModel {
  isActive: boolean;
}
