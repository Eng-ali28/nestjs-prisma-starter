import { Global, Module } from '@nestjs/common';
import FileDeleteService from './file-delete.service';

import { TasksService } from './tasks.service';

import { TranslateException } from './translate.exciption.service';

@Global()
@Module({
  providers: [FileDeleteService, TasksService, TranslateException],
  exports: [FileDeleteService, TranslateException],
})
export default class UtilModule {}
