import { EmitEvent, EmitsEvent, Event } from '@squareboat/nest-events';

@Event(UserRequestedOtp.name)
export class UserRequestedOtp extends EmitsEvent {
  public data;
  constructor(data) {
    super();
    this.data = data;
  }
}
