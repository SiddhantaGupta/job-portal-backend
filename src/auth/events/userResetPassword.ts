import { EmitEvent, EmitsEvent, Event } from '@squareboat/nest-events';

@Event(UserResetPassword.name)
export class UserResetPassword extends EmitsEvent {
  public data;
  constructor(data) {
    super();
    this.data = data;
  }
}
