import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UserService } from './user.service.js';
import { User } from '../../prisma/generated/client.js';
import { Ttl } from '../../common/utils/ttl.util.js';
import { UserCacheInterceptor } from './interptors/user-cache-key.interceptor.js';

/**
 * UserController
 *
 * This controller demonstrates the usage of caching at the controller layer
 * using NestJS built-in decorators and interceptors.
 *
 * The implementation is intentionally demonstrative, aimed at showing:
 * - How caching can be applied at the HTTP layer
 * - How built-in CacheInterceptor and decorators are combined
 * - How a custom interceptor can be used to generate dynamic cache keys
 *
 * This is not intended as a full production reference,
 * but as a clear example of caching mechanics in NestJS controllers.
 */
@Controller('users')
export class UserController {
  /**
   * Injects UserService.
   *
   * Responsibility separation:
   * - Controller: HTTP concerns (routing, caching, parameter binding)
   * - Service: business logic and data access
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves all users.
   *
   * Caching strategy:
   * - Uses a static cache key because the response
   *   does not depend on request parameters.
   * - Short TTL to balance performance and data freshness.
   *
   * Purpose:
   * - Demonstrates usage of @CacheKey and @CacheTTL decorators
   *   directly at the controller method level.
   */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('users:all')
  @CacheTTL(Ttl.minutes(5))
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Retrieves a single user by ID.
   *
   * Caching strategy:
   * - Cache key is generated dynamically via a custom interceptor.
   * - Longer TTL since individual user records typically change less frequently.
   *
   * Purpose:
   * - Demonstrates how to delegate cache key generation logic
   *   to a custom interceptor instead of hardcoding it in decorators.
   * - Shows how built-in caching decorators and custom interceptors
   *   can coexist cleanly at the controller layer.
   *
   * Best practice illustrated:
   * - Avoid parameter-based cache keys in decorators.
   * - Centralize dynamic cache key logic inside interceptors
   *   for consistency and reusability.
   */
  @Get(':id')
  @UseInterceptors(UserCacheInterceptor)
  @CacheTTL(Ttl.minutes(15))
  findOne(@Param('id') id: User['id']) {
    return this.userService.findOne(id);
  }
}
