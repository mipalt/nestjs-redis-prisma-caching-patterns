import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LoggerService } from '../../logger/logger.service.js';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ServiceResponse } from '../../shared/types/response.interface.js';
import { PostResponse } from './interfaces/post.interface.js';
import { Ttl } from '../../common/utils/ttl.util.js';
import { postSelect } from './persistence/post.select.js';
import { success } from '../../common/utils/success.util.js';
import { Post } from '../../prisma/generated/client.js';

@Injectable()
export class PostService {
  /**
   * PostService
   *
   * This service demonstrates caching at the service layer.
   *
   * Responsibility separation:
   * - Service: business logic, data access, and cache orchestration
   * - Cache: performance optimization (non-blocking, best-effort)
   *
   * Cache failures must never break the main request flow.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Safely retrieves data from cache.
   *
   * Purpose:
   * - Centralizes cache error handling
   * - Prevents repetitive try–catch blocks
   * - Ensures cache failures never propagate to global exception filter
   */
  private async safeCacheGet<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      return value ?? null;
    } catch (error) {
      this.logger.warn('Cache get failed', { key, error });
      return null;
    }
  }

  /**
   * Safely stores data in cache.
   *
   * Purpose:
   * - Isolates cache write failures
   * - Keeps service methods focused on business logic
   */
  private async safeCacheSet<T>(
    key: string,
    value: T,
    ttl: number,
  ): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.warn('Cache set failed', { key, error });
    }
  }

  /**
   * Retrieves all posts.
   *
   * Caching strategy:
   * - Static cache key since the response does not depend on parameters
   * - Short TTL to balance freshness and performance
   *
   * Cache location:
   * - Service layer, not controller
   * - Suitable when caching is part of business optimization,
   *   not HTTP-layer concern
   */
  async findAll(): Promise<ServiceResponse<PostResponse[]>> {
    const cacheKey = 'posts:all';
    const cacheTtl = Ttl.minutes(1);

    const cached = await this.safeCacheGet<PostResponse[]>(cacheKey);
    if (cached) return success(cached);

    const posts = await this.prisma.post.findMany({
      select: postSelect,
    });

    await this.safeCacheSet(cacheKey, posts, cacheTtl);

    return success(posts);
  }

  /**
   * Retrieves a single post by ID.
   *
   * Caching strategy:
   * - Parameterized cache key scoped by post ID
   * - Moderate TTL since individual posts change less frequently
   *
   * Notes:
   * - Prisma errors are intentionally not caught here
   * - They must propagate to the global exception filter
   */
  async findOne(id: Post['id']): Promise<ServiceResponse<PostResponse>> {
    const cacheKey = `posts:${id}`;
    const cacheTtl = Ttl.minutes(5);

    const cached = await this.safeCacheGet<PostResponse>(cacheKey);
    if (cached) return success(cached);

    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id },
      select: postSelect,
    });

    await this.safeCacheSet(cacheKey, post, cacheTtl);

    return success(post);
  }
}
