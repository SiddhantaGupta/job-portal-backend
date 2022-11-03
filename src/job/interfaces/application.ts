import { ObjectionModel } from '@libs/boat';

export interface IApplicationModel extends ObjectionModel {
  id?: number;
  uuid?: string;
  userId?: number;
  jobId?: number;
}
