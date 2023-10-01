import { SetMetadata } from '@nestjs/common';

export const Is_Public_key = 'isPublic';

export const Public = () => SetMetadata(Is_Public_key, true);
