import { Dispatch } from '@libs/sq-nest-queue';
import { Injectable } from '@nestjs/common';
import { ListensTo } from '@squareboat/nest-events';
import { UserRequestedOtp } from '../events/userRequestedOtp';

@Injectable()
export class AuthModuleListener {
  @ListensTo(UserRequestedOtp.name)
  sendOtp(event: UserRequestedOtp) {
    Dispatch({
      job: 'SEND_MAIL',
      data: {
        email: event.data.email,
        message: event.data.message,
        subject: event.data.subject,
      },
      connection: 'notifications',
    });
  }
}
