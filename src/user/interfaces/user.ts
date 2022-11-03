import { ObjectionModel } from '@libs/boat';
import { BaseModel } from '@squareboat/nestjs-objection';

export interface IUserModel extends ObjectionModel {
  id?: number;
  uuid?: string;
  role?: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
}
