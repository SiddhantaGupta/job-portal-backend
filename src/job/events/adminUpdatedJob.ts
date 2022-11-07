import { EmitEvent, EmitsEvent, Event } from '@squareboat/nest-events';

@Event(AdminUpdatedJob.name)
export class AdminUpdatedJob extends EmitsEvent {
  public data;
  constructor(data) {
    super();
    this.data = data;
  }
}
