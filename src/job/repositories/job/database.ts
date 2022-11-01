import { Injectable } from '@nestjs/common';
import { JobRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';
import { JobModel } from '@app/job/models';

@Injectable()
export class JobRepository
  extends DatabaseRepository<JobModel>
  implements JobRepositoryContract
{
  @InjectModel(JobModel)
  model: JobModel;
}
