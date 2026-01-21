import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino, { Logger } from 'pino';

type LogMeta = Record<string, unknown>;

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor(private readonly config: ConfigService) {
    const nodeEnv = this.config.get('app.nodeEnv', { infer: true });
    const logLevel = this.config.get('app.logLevel', { infer: true });

    this.logger = pino({
      level: logLevel,
      base: {
        pid: false,
        hostname: false,
      },
      transport:
        nodeEnv === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
              },
            }
          : undefined,
    });
  }

  info(message: string, meta?: LogMeta) {
    this.logger.info(meta, message);
  }

  warn(message: string, meta?: LogMeta) {
    this.logger.warn(meta, message);
  }

  error(message: string, meta?: LogMeta) {
    this.logger.error(meta, message);
  }

  debug(message: string, meta?: LogMeta) {
    this.logger.debug(meta, message);
  }

  trace(message: string, meta?: LogMeta) {
    this.logger.trace(meta, message);
  }
}
