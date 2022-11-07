import { ObjectionModel } from '@libs/boat';

export interface IJobModel extends ObjectionModel {
  id?: number;
  uuid?: string;
  postedBy?: number;
  isActive?: boolean;
}
