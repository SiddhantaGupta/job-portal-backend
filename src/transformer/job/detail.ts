import { Transformer } from '@libs/boat';

export class JobDetailTransformer extends Transformer {
  async transform(model: Record<string, any>): Promise<Record<string, any>> {
    return {
      id: model.uuid,
      title: model.title,
      description: model.description,
      location: model.location,
      employmentType: model.employmentType,
      companyName: model.companyName,
    };
  }
}
