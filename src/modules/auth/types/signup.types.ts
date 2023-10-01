import { User } from '@prisma/client';

export type RegisterUser = User & { accessToken: string; refreshToken: string };
