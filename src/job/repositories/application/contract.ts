import {
  IApplicationModel,
  IApplicationSearchModel,
} from '@app/job/interfaces';
import { ApplicationModel } from '@app/job/models';
import { Pagination, RepositoryContract } from '@squareboat/nestjs-objection';

export interface ApplicationRepositoryContract
  extends RepositoryContract<IApplicationModel> {
  search(
    inputs: IApplicationSearchModel,
  ): Promise<Pagination<IApplicationModel>>;
}
