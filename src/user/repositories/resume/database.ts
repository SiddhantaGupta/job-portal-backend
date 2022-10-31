import { ResumeModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { ResumeRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class ResumeRepository
  extends DatabaseRepository<ResumeModel>
  implements ResumeRepositoryContract
{
  @InjectModel(ResumeModel)
  model: ResumeModel;
}
