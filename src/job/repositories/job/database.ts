import { Injectable } from '@nestjs/common';
import { JobRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel, Pagination } from '@libs/sq-obj';
import { JobModel } from '@app/job/models';
import { IJobModel, IJobSearchModel } from '@app/job/interfaces';

@Injectable()
export class JobRepository
  extends DatabaseRepository<IJobModel>
  implements JobRepositoryContract
{
  @InjectModel(JobModel)
  model: JobModel;

  async search(inputs: IJobSearchModel): Promise<Pagination<IJobModel>> {
    const query = this.query();
    if (inputs.search) {
      query.where('title', 'ilike', `%${inputs.search}%`);
      query.orWhere('location', 'ilike', `%${inputs.search}%`);
    }
    if (inputs.isActive === true || inputs.isActive === false) {
      query.where({
        'jobs.isActive': inputs.isActive,
      });
    }
    if (inputs.userId) {
      query.where({
        postedBy: inputs.userId,
      });
    }
    if (inputs.candidateId) {
      query
        .withGraphJoined('applications')
        .modifyGraph('applications', (builder) => {
          builder.where({
            userId: inputs.candidateId,
          });
        })
        .whereNull('applications.id');
    }

    query.orderBy('updatedAt', 'desc');

    const searchResult: Pagination<IJobModel> = await query.paginate(
      inputs.page || 1,
      inputs.perPage || 8,
    );

    return searchResult;
  }
}
