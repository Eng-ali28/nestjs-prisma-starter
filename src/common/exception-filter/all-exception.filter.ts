import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';
import { Prisma } from '@prisma/client';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { IErrorResponse } from './types';

@Catch()
export default class AppExceptioFilter implements ExceptionFilter {
  constructor(private httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    let message = 'INTERNAL_SERVER_ERROR';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    console.log(exception);

    if (exception instanceof HttpException) {
      const { response } = exception as any;
      message = Array.isArray(response.message) ? response.message[0] : response.message;
      status = exception.getStatus();
    }

    if (exception instanceof ThrottlerException) {
      message = 'Too many requests on this route, please try again later.';
      status = HttpStatus.TOO_MANY_REQUESTS;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          message = `The ${exception.meta.target} already exists.`;
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'P2000':
          message = `The provided value not available to ${exception.meta.column_name}.`;
          status = HttpStatus.NOT_ACCEPTABLE;
          break;
        case 'P2003':
          message = exception.message;
          status = HttpStatus.NOT_ACCEPTABLE;
          break;
        case 'P2025':
          message = (exception.meta ? (exception.meta.cause as unknown as string) : undefined) || exception.message;
          status = HttpStatus.NOT_FOUND;
          break;
        default:
          message = 'Invalid input.';
          status = HttpStatus.BAD_REQUEST;
      }
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      message = exception.message as string;

      status = HttpStatus.NOT_ACCEPTABLE;
    }

    const response: IErrorResponse = {
      success: false,
      statusCode: status,
      message,
    };

    this.writeHttpLog(response);

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), response, status);
  }

  private async writeHttpLog(body: Record<string, any>): Promise<void> {
    const LOGS_DIR = join(__dirname, '../../logger', `${Date.now()}-log.json`);

    try {
      if (!existsSync(join(__dirname, '../../logger'))) mkdirSync(join(__dirname, '../../logger'));

      await writeFile(LOGS_DIR, JSON.stringify(body));
    } catch (error) {
      return;
    }
  }
}
