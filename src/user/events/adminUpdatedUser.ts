import { EmitEvent, EmitsEvent, Event } from '@squareboat/nest-events';

@Event(AdminUpdatedUser.name)
export class AdminUpdatedUser extends EmitsEvent {
  public data;
  constructor(data) {
    super();
    this.data = data;
  }
}
