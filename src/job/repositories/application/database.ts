import { Injectable } from '@nestjs/common';
import { ApplicationRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';
import { ApplicationModel, JobModel } from '@app/job/models';

@Injectable()
export class ApplicationRepository
  extends DatabaseRepository<ApplicationModel>
  implements ApplicationRepositoryContract
{
  @InjectModel(ApplicationModel)
  model: ApplicationModel;
}
