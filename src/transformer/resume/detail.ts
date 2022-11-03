import { Transformer } from '@libs/boat';

export class ResumeDetailTransformer extends Transformer {
  availableIncludes = ['extra', 'address', 'pin'];
  defaultIncludes = ['pin'];

  async transform(model: Record<string, any>): Promise<Record<string, any>> {
    return {
      experienceDuration: model.experienceDuration,
      fieldOfWork: model.fieldOfWork,
      skills: model.skills,
    };
  }
}
