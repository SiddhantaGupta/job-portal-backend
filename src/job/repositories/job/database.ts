import { Injectable } from '@nestjs/common';
import { JobRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';
import { JobModel } from '@app/job/models';
import { IJobModel } from '@app/job/interfaces';

@Injectable()
export class JobRepository
  extends DatabaseRepository<IJobModel>
  implements JobRepositoryContract
{
  @InjectModel(JobModel)
  model: JobModel;
  // this.query().withGraphFetched({apllications:true})
}
