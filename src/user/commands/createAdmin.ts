import { BaseValidator, validate } from '@libs/boat/validator';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import bcrypt from 'bcrypt';
import { UserModuleConstants } from '../constants';
import { Admin } from '../dtos/admin';
import { UserRepositoryContract } from '../repositories';

@Injectable()
@Command('create:admin')
export class CreateAdmin {
  constructor(
    @Inject(UserModuleConstants.userRepo) public repo: UserRepositoryContract,
    private config: ConfigService,
    private validator: BaseValidator,
  ) {}
  public async handle(_cli: ConsoleIO): Promise<void> {
    let admin = {
      role: this.config.get('settings.roles').admin,
      email: '',
      password: '',
    };

    admin.email = await _cli.ask('Enter your email: ');
    admin.password = await _cli.ask('Enter your password: ');

    let validatedInputs;
    try {
      validatedInputs = await this.validator.fire(admin, Admin);
    } catch (err) {
      return;
    }

    validatedInputs.password = await bcrypt.hash(validatedInputs.password, 10);

    let user = await this.repo.create({
      ...validatedInputs,
    });

    if (user) {
      _cli.info('Admin user created successfully!');
    } else {
      _cli.info('something went wrong :(');
    }

    return;
  }
}
