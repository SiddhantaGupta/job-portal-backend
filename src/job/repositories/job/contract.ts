import { IJobModel } from '@app/job/interfaces';
import { IJobSearchModel } from '@app/job/interfaces';
import { JobModel } from '@app/job/models';
import { Pagination, RepositoryContract } from '@squareboat/nestjs-objection';

export interface JobRepositoryContract extends RepositoryContract<IJobModel> {
  search(inputs: IJobSearchModel): Promise<Pagination<IJobModel>>;
}
