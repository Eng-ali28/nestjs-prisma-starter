import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaOptionsFactory } from 'nestjs-prisma';
import { PrismaServiceOptions } from 'nestjs-prisma/dist/interfaces';

@Injectable()
export class PrismaConfig implements PrismaOptionsFactory {
  constructor(private configService: ConfigService) {}
  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    return {
      prismaOptions: {
        log: ['info', 'query'],
      },
      explicitConnect: true,
    };
  }
}
