import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.dto';

export default class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['phoneNumber', 'password', 'role'])) {}
