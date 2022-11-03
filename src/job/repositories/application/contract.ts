import {
  IApplicationModel,
  IApplicationSearchModel,
} from '@app/job/interfaces';
import { Pagination, RepositoryContract } from '@libs/sq-obj';

export interface ApplicationRepositoryContract
  extends RepositoryContract<IApplicationModel> {
  search(
    inputs: IApplicationSearchModel,
  ): Promise<Pagination<IApplicationModel>>;
}
