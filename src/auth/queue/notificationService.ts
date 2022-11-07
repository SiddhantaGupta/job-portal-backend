import { Job } from '@libs/sq-nest-queue';
import { Injectable } from '@nestjs/common';
import { Mailman, MailMessage } from 'libs/nest-mailman/src';

@Injectable()
export class NotificationService {
  @Job('SEND_MAIL')
  sendMail(data: Record<string, any>) {
    const mail = MailMessage.init()
      .greeting('Hello user')
      .line(data.message)
      .subject(data.subject);

    Mailman.init().to(data.email).send(mail);
  }
}
