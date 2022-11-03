import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import bcrypt from 'bcrypt';
import { UserModuleConstants } from '../constants';
import { UserRepositoryContract } from '../repositories';

@Injectable()
@Command('create:admin')
export class CreateAdmin {
  constructor(
    @Inject(UserModuleConstants.userRepo) public repo: UserRepositoryContract,
    private config: ConfigService,
  ) {}
  public async handle(_cli: ConsoleIO): Promise<void> {
    let admin = {
      role: this.config.get('settings.roles').admin,
      email: '',
      password: '',
    };

    admin.email = await _cli.ask('Enter your email: ');
    admin.password = await _cli.ask('Enter your password: ');

    admin.password = await bcrypt.hash(admin.password, 10);

    let user = await this.repo.create({
      ...admin,
    });

    _cli.info('Admin user created');

    return;
  }
}
