# NestJS Redis Prisma Caching Patterns

## Project Description

This repository provides **best-practice examples for integrating NestJS, Redis, and Prisma**, with a strong focus on **caching strategies across different application layers**.

The project is designed to help developers understand:

* How to integrate Redis caching into NestJS correctly
* The difference between **controller-level caching** and **service-level caching**
* How to treat cache as an *optional dependency* (non-blocking)
* Architectural patterns commonly used in production systems

The examples are implemented through **two intentionally different modules** (`User` and `Post`) to demonstrate real-world caching use cases.

---

## Technologies Used

* **NestJS** – Backend framework
* **Prisma ORM** – Database access layer
* **Redis** – Cache store
* **Keyv** – Cache abstraction layer
* **Docker & Docker Compose** – Environment consistency
* **pnpm** – Package manager

---

## Related Packages

Key packages related to caching and data access:

```json
"@keyv/redis": "^5.1.6",
"@nestjs/cache-manager": "^3.1.0",
"@prisma/client": "^7.2.0",
"@nestjs/cli": "^11.0.0"
```

---

## Project Setup

### Prerequisites

* Docker & Docker Compose
* Node.js (LTS)
* pnpm

Copy the environment file:

```bash
cp .env.example .env
```

Fill in database credentials, Redis configuration, and other required environment variables.

---

### Option 1 — Run with Docker (Recommended)

Docker is the **source of truth** for this project environment.

```bash
docker compose up --build
```

Benefits:

* Consistent environment
* No local dependency conflicts
* Closely matches production setup

---

### Option 2 — Run Locally with pnpm (Optional)

Provided for development convenience and debugging.

> Note: Database and Redis **must still be run via Docker**.

```bash
pnpm install
pnpm start:dev
```

---

## User vs Post Module — Architectural Differences

These two modules are intentionally designed to demonstrate **two different caching approaches** commonly used in NestJS applications.

---

### User Module — Controller-Level Caching

Caching is applied at the **HTTP layer** using NestJS built-in decorators and interceptors.

Characteristics:

* Uses `CacheInterceptor`
* Cache key and TTL are declared in the controller
* Suitable for demonstrating request–response caching mechanics

Example:

```ts
@Get()
@UseInterceptors(CacheInterceptor)
@CacheKey('users:all')
@CacheTTL(Ttl.minutes(5))
findAll() {
  return this.userService.findAll();
}
```

For parameter-based caching, a **custom interceptor** (`UserCacheInterceptor`) is used to generate dynamic cache keys, keeping decorators clean and consistent.

Purpose of this module:

* Educational demonstration
* Documentation of NestJS built-in caching features
* HTTP-layer caching example

---

### Post Module — Service-Level Caching

Caching is implemented directly in the **service layer** as part of business logic optimization.

Characteristics:

* Uses `cacheManager` manually
* Cache is treated as a *best-effort optimization*
* Cache failures never block the main request flow

Example:

```ts
const cached = await this.safeCacheGet<PostResponse[]>(cacheKey);
if (cached) return success(cached);
```

Cache read/write operations are encapsulated in internal helpers (`safeCacheGet`, `safeCacheSet`) to:

* Eliminate repetitive `try–catch` blocks
* Centralize cache error handling
* Keep service methods focused on business logic

Purpose of this module:

* Real-world production pattern
* Cache reuse beyond HTTP layer
* Scalable and maintainable architecture

---

## Architectural Principles

* Cache is an **optional dependency**
* Database is a **mandatory dependency**
* Cache failures must not break API responses
* Business and data errors propagate to the global exception filter
* Cache TTL is chosen based on data characteristics

---

## Repository Goal

This repository is **not a production-ready template**, but:

* An architectural reference
* A learning resource
* A demonstration of industry-standard patterns

Developers are encouraged to understand **why** each decision is made, not just how it is implemented.

---

## License

MIT
