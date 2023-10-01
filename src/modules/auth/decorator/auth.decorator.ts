import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Permission, PERMISSION_KEY } from './permission.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import ActivateGuard from '../guards/activate.guard';
import { PERMISSION } from '@prisma/client';

export default function Auth(...permissions: PERMISSION[]) {
  return applyDecorators(Permission(...permissions), UseGuards(JwtAuthGuard, ActivateGuard));
}
