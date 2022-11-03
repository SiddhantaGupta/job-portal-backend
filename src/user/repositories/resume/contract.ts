import { IResumeModel } from '@app/user/interfaces';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface ResumeRepositoryContract
  extends RepositoryContract<IResumeModel> {}
