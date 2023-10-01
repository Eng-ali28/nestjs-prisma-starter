import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcryptjs';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import UpdateUserDto from './dto/update.dto';
import FileDeleteService from 'src/common/util/file-delete.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService, private fileDelete: FileDeleteService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, role, ...data } = createUserDto;

    const hashPassword = await this.hashPassoword(password);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
        role: { connect: { name: role } },
      },

      include: { role: { select: { name: true } } },
    });

    return user;
  }

  async updateUserById(userId: string, updateUserDto: UpdateUserDto, include?: Prisma.UserInclude): Promise<User> {
    const user = await this.prisma.user.update({ where: { id: userId }, data: updateUserDto, include });
    return user;
  }

  async updateUserByPhoneNumber(phoneNumber: string, updateUserDto: UpdateUserDto, include?: Prisma.UserInclude): Promise<User> {
    const user = await this.prisma.user.update({ where: { phoneNumber }, data: updateUserDto, include });
    return user;
  }

  async setUserImage(userId: string, image: string): Promise<User> {
    const oldUser = await this.getUserById(userId);

    const newUser = await this.prisma.user.update({ where: { id: userId }, data: { image } });

    oldUser.image ? await this.fileDelete.deleteSinglePath(oldUser.image) : null;

    return newUser;
  }

  async getUserById(userId: string, include?: Prisma.UserInclude): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include,
    });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async getUserByPhone(phoneNumber: string, include?: Prisma.UserInclude): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
      include,
    });

    return user;
  }

  deleteUserByAdmin(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async toggleActivateUser(id: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { isActive: true, name: true },
    });
    if (!user) throw new NotFoundException('User not found.');

    const isActive = !user.isActive;

    await this.prisma.user.update({ where: { id }, data: { isActive: isActive } });

    return isActive ? `${user.name} now Active.` : `${user.name} now unactive.`;
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  }

  async resetPasswordById(user_id: string, resettPasswordDto: ResetPasswordDto): Promise<string> {
    const { newPassword, currentPassword } = resettPasswordDto;

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: user_id }, select: { password: true } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) throw new ConflictException('Invalid current password.');

    const hashPassword = await this.hashPassoword(newPassword);

    await this.prisma.user.update({
      data: { password: hashPassword },
      where: { id: user_id },
    });

    return 'Your password changed successfully';
  }

  async setNewPasswordByPhoneNumber(phoneNumber: string, newPassword: string): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      data: { password: newPassword },
      where: { phoneNumber },
    });

    return updatedUser;
  }

  async hashPassoword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }
}
