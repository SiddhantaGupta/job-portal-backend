import { ResumeModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { ResumeRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@libs/sq-obj';
import { IResumeModel } from '@app/user/interfaces';

@Injectable()
export class ResumeRepository
  extends DatabaseRepository<IResumeModel>
  implements ResumeRepositoryContract
{
  @InjectModel(ResumeModel)
  model: ResumeModel;
}
