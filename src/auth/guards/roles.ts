import { GenericException } from '@libs/boat';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    let roles = this.reflector.get('roles', context.getHandler());
    if (!roles) {
      roles = this.reflector.get('roles', context.getClass());
    }
    if (!roles) {
      return true;
    }
    const userRoles = this.config.get('settings.roles');

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (
      (user.role === userRoles.recruiter ||
        user.role === userRoles.candidate) &&
      !user.isActive
    ) {
      throw new GenericException('Your account has been blocked by the admin');
    }
    return this.matchRoles(roles, user.role);
  }

  matchRoles(rolesList: Array<string>, role: string): boolean {
    const userRoles = this.config.get('settings.roles');
    return rolesList.includes(
      Object.keys(userRoles).find((key) => userRoles[key] === role),
    );
  }
}
