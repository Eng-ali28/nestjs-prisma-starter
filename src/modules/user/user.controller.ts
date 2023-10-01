import { Controller } from '@nestjs/common';
import UserService from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Public()
  // @Auth(PERMISSION.CREATE_USER)
  // @Post()
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //     return await this._userService.createUser(createUserDto);
  // }

  // @Auth(PERMISSION.UPDATE_USER)
  // @Put('update/:id')
  // async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
  //     return await this._userService.updateUserById(id, updateUserDto);
  // }

  // @Auth(PERMISSION.UPDATE_USER)
  // @Put('set-image')
  // @UseInterceptors(FileInterceptor('image'), ImageInterceptor)
  // async setUserImage(
  //     @User() user: Payload,
  //     @UploadedFile(...ImageProcessingFactory(true)) file: Express.Multer.File,
  // ) {
  //     return await this._userService.setUserImage(user.userId, file.path);
  // }

  // @Put('toggle-activate/:id')
  // @Auth(PERMISSION.TOGGLE_ACTIVATE_USER)
  // async toggleActivateUser(@Param('id', ParseUUIDPipe) id: string) {
  //     return await this._userService.toggleActivateUser(id);
  // }

  // @Auth(PERMISSION.UPDATE_USER)
  // @Put('reset-password')
  // async resetPassword(@User(USER.ID) id: string, @Body() resetPasswordDto: ResetPasswordDto): Promise<string> {
  //     return await this._userService.resetPasswordById(id, resetPasswordDto);
  // }

  // @Get('me')
  // @Auth()
  // async getMe(@User(USER.ID) userId: string) {
  //     return await this._userService.getMe(userId);
  // }
}
