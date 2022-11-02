import { ApplicationModel } from '@app/job/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface ApplicationRepositoryContract
  extends RepositoryContract<ApplicationModel> {}
