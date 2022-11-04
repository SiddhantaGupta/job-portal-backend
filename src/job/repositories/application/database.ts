import { Injectable } from '@nestjs/common';
import { ApplicationRepositoryContract } from './contract';
import {
  DatabaseRepository,
  InjectModel,
  Pagination,
} from '@squareboat/nestjs-objection';
import { ApplicationModel } from '@app/job/models';
import {
  IApplicationModel,
  IApplicationSearchModel,
} from '@app/job/interfaces';

@Injectable()
export class ApplicationRepository
  extends DatabaseRepository<IApplicationModel>
  implements ApplicationRepositoryContract
{
  @InjectModel(ApplicationModel)
  model: ApplicationModel;

  async search(
    inputs: IApplicationSearchModel,
  ): Promise<Pagination<IApplicationModel>> {
    const query = this.query();

    if (inputs.jobId) {
      query.where({
        jobId: inputs.jobId,
      });
    }
    if (inputs.userId) {
      query.where({
        userId: inputs.userId,
      });
    }

    const searchResult: Pagination<IApplicationModel> = await query.paginate(
      inputs.page || 1,
      inputs.perPage || 15,
    );

    return searchResult;
  }
}
