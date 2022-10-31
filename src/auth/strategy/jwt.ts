import { UserService } from '@app/user';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    uuid: string
  }) {

    console.log(payload)

    // fetch user from database
    const user = await this.userService.repo.query().findOne({
        uuid: payload.uuid
    })

    return user;
  }
}