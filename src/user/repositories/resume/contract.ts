import { ResumeModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface ResumeRepositoryContract extends RepositoryContract<ResumeModel> {}
