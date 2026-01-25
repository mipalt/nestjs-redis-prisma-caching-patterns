import { Module, ValidationPipe } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from './config/env.schema.js';
import configuration from './config/configuration.js';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exeption.filter.js';
import { UserModule } from './module/user/user.module.js';
import { PostModule } from './module/post/post.module.js';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor.js';
import { LoggerModule } from './logger/logger.module.js';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Ttl } from './common/utils/ttl.util.js';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PostModule,
    LoggerModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (env) => envSchema.parse(env),
      load: [configuration],
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('redis.host', { infer: true });
        const port = config.get<number>('redis.port', { infer: true });
        return {
          stores: [new KeyvRedis(`redis://${host}:${port}`)],
          ttl: Ttl.minutes(2),
        };
      },
    }),
  ],

  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
