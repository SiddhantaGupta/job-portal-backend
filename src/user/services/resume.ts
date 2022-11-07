import { Injectable, Inject } from '@nestjs/common';
import { UserModuleConstants } from '../constants';
import { ResumeRepositoryContract } from '../repositories/resume/contract';

@Injectable()
export class ResumeService {
  constructor(
    @Inject(UserModuleConstants.resumeRepo) public resume: ResumeRepositoryContract,
  ) {}
}
