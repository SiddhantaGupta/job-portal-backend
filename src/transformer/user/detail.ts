import { Transformer } from '@libs/boat';
import { ResumeDetailTransformer } from '../resume';

export class UserDetailTransformer extends Transformer {
  availableIncludes = ['extra', 'address', 'pin'];
  defaultIncludes = ['pin'];

  async transform(model: Record<string, any>): Promise<Record<string, any>> {
    return {
      id: model.uuid,
      firstName: model.firstName,
      lastName: model.lastName,
      role: model.role,
      email: model.email,
      phoneNumber: model.phoneNumber,
      resume:
        model.resume &&
        (await this.item(model.resume, new ResumeDetailTransformer())),
      accessToken: model.accessToken,
      otp: model.otp,
      isActive: model.isActive,
    };
  }

  async includeExtra(user: Record<string, any>): Promise<Record<string, any>> {
    return { username: user.username };
  }

  async includeAddress(
    user: Record<string, any>,
  ): Promise<Record<string, any>> {
    return { country: 'INDIA', cityName: 'Gurugram' };
  }

  async includePin(user: Record<string, any>): Promise<Record<string, any>> {
    return { code: '122002' };
  }
}
