import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

class EnvironmentVariable {
  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNotEmpty({ message: 'JWT_SECRET must be exists in environment variable.' })
  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsNotEmpty({ message: 'JWT_SECRET must be exists in environment variable.' })
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsNotEmpty({ message: 'EXPIRE_IN must be exists in environment variable.' })
  @IsString()
  EXPIRE_IN: string;

  @IsNotEmpty({
    message: 'DATABASE_URL must be exists in environment variable.',
  })
  @IsString()
  DATABASE_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariable, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new HttpException(
      errors.toString(),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return validatedConfig;
}
