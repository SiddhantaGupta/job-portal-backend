import { Transformer } from '@libs/boat';
import { JobDetailTransformer } from '../job';
import { UserDetailTransformer } from '../user';

export class ApplicationDetailTransformer extends Transformer {
  async transform(model: Record<string, any>): Promise<Record<string, any>> {
    return {
      id: model.uuid,
      job:
        model.job && (await this.item(model.job, new JobDetailTransformer())),
      applicant:
        model.applicant &&
        (await this.item(model.applicant, new UserDetailTransformer())),
    };
  }
}
