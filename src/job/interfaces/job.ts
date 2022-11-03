import { ObjectionModel } from '@libs/boat';

export interface IJobModel extends ObjectionModel {
  id?: number;
  isActive: boolean;
}
