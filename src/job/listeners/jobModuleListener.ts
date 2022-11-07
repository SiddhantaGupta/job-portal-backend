import { Dispatch } from '@libs/sq-nest-queue';
import { Injectable } from '@nestjs/common';
import { ListensTo } from '@squareboat/nest-events';
import { AdminUpdatedJob } from '../events/adminUpdatedJob';

@Injectable()
export class JobModuleListener {
  @ListensTo(AdminUpdatedJob)
  jobUpdated(event: AdminUpdatedJob) {
    Dispatch({
      job: 'JOB_UPDATED',
      data: event.data,
      connection: 'notifications',
    });
  }
}
