import { JobModel } from '@app/job/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface JobRepositoryContract extends RepositoryContract<JobModel> {}
