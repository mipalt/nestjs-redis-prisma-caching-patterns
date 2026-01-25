import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    if (request.method !== 'GET' || !request.params?.id) {
      return undefined;
    }

    return `users:${request.params.id}`;
  }
}
