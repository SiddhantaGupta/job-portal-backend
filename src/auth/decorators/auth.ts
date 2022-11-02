import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard } from '../guards';

export function Auth(...roles: Array<string>) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtGuard, RolesGuard),
  );
}
