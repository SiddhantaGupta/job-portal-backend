import { Transformer } from '@libs/boat';

export class ApplicationDetailTransformer extends Transformer {
  async transform(model: Record<string, any>): Promise<Record<string, any>> {
    return {
      id: model.uuid,
      userId: model.userId,
      jobId: model.jobId,
    };
  }
}
