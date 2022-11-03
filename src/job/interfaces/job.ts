import { ObjectionModel } from '@libs/boat';

export interface IJobModel extends ObjectionModel {
  id?: number;
  uuid?: string;
  isActive?: boolean;
}
