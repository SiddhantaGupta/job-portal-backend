import { Injectable } from '@nestjs/common';
import { ApplicationRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';
import { ApplicationModel } from '@app/job/models';
import { IApplicationModel } from '@app/job/interfaces';

@Injectable()
export class ApplicationRepository
  extends DatabaseRepository<IApplicationModel>
  implements ApplicationRepositoryContract
{
  @InjectModel(ApplicationModel)
  model: ApplicationModel;
}
