import { AdminUpdatedUser } from '@app/user/events/adminUpdatedUser';
import { Dispatch } from '@libs/sq-nest-queue';
import { Injectable } from '@nestjs/common';
import { ListensTo } from '@squareboat/nest-events';

@Injectable()
export class UserModuleListener {
  @ListensTo(AdminUpdatedUser)
  sendUserUpdatedEvent(event: AdminUpdatedUser) {
    Dispatch({
      job: 'USER_UPDATED',
      data: event.data,
      connection: 'notifications',
      delay: 0,
    });
  }
}
