import { IResumeModel } from '@app/user/interfaces';
import { RepositoryContract } from '@libs/sq-obj';

export interface ResumeRepositoryContract
  extends RepositoryContract<IResumeModel> {}
