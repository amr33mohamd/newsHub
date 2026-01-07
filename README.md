<div align="center">
  <img src="./screenshot.png" alt="NewsHub Application Screenshot" width="100%">
</div>

# NewsHub - Full-Stack News Aggregator

A news aggregation platform built for innoscripta's take-home challenge. This project pulls articles from NewsAPI.org, The Guardian, and The New York Times, storing them locally for fast filtering and personalized feeds.

**Stack:** Laravel 11 + Next.js 15 (TypeScript) + Docker

## What I Built

I went beyond the basic requirements because I wanted to demonstrate how I'd approach a real production system. Instead of just making the features work, I focused on building something maintainable and extensible.

### Core Features (As Required)
- User authentication with Laravel Sanctum
- Article search and filtering (keyword, date, source, category, author)
- Personalized news feed based on user preferences
- Mobile-responsive design with Tailwind
- All data fetched via scheduled commands and stored locally

### What Makes This Implementation Different

**1. Adapter Pattern for News Sources**

Rather than hardcoding each API's logic, I built an adapter system. Each news source (NewsAPI, Guardian, NYT) has its own adapter class that handles the API-specific quirks:

```php
abstract class AbstractNewsAdapter {
    abstract protected function extractArticles(array $data): array;
    public function fetchArticles(array $params = []): ?array { }
}
```

Why? Because news APIs are inconsistent. The Guardian returns `response.results`, NewsAPI returns `articles`, NYT has its own structure. The adapter pattern means adding a new source is just creating a new adapter class - no touching existing code.

**2. Repository + Service Layer Architecture**

I separated concerns into distinct layers:
- **Controllers**: Handle HTTP, nothing else
- **Form Requests**: All validation logic lives here
- **Services**: Business logic and orchestration
- **Repositories**: Database operations only
- **Helpers**: Reusable utilities (transformers, category/author management)

The strict rule I followed: Services never touch the database directly. All DB operations go through repositories. This made testing way easier and keeps the codebase flexible.

**3. Configuration-Driven Design**

All news sources are defined in `config/news_sources.php` with field mappings:

```php
'guardian' => [
    'field_mapping' => [
        'title' => 'webTitle',
        'description' => 'fields.trailText',
        'content' => 'fields.bodyText',
        // ...
    ]
]
```

This means I can add a new source without changing code - just add config. I even built a CLI command (`php artisan news:add-source`) that scaffolds everything automatically.

**4. React Query with Query Key Factories**

On the frontend, I used TanStack Query (React Query v5) with a query key factory pattern:

```typescript
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (page: number, filters?: ArticleFilters) =>
    [...articleKeys.lists(), { page, ...filters }] as const,
};
```

This gives me granular cache control. When a user updates their preferences, I can invalidate just the personalized feed queries without touching the main article list cache.

## Technical Decisions & Trade-offs

**Why Laravel Sanctum over JWT?**
Simpler to implement, built into Laravel, and perfect for SPA authentication. For this scale, it's the right choice.

**Why Next.js App Router over Pages Router?**
I wanted to use the latest patterns. App Router is more verbose but the server/client component split makes sense for this use case.

**Why store articles locally vs. fetching on-demand?**
The requirements specified this, but it's also the right call. Free tier API limits are tight (NewsAPI gives 100 requests/day). By fetching hourly and storing locally, we can support unlimited users filtering without hitting rate limits.

**Why TypeScript strict mode?**
Catches bugs at compile time. The initial setup takes longer, but it pays off when refactoring.

**Why React Query + Axios (not just one)?**
They're complementary, not redundant:
- **Axios** (HTTP client): Handles the actual network requests. Provides interceptors for adding auth tokens to every request, global error handling for 401s, request/response transformation, and better error messages than fetch().
- **React Query** (state manager): Manages server state - caching, automatic refetching, loading/error states, cache invalidation, optimistic updates.

React Query doesn't make HTTP requests itself - it calls functions that return promises. Those functions use Axios:
```typescript
// React Query decides WHEN to fetch
useQuery({
  queryKey: ['articles'],
  queryFn: fetchArticles  // ← This function uses Axios
})

// Axios handles HOW to fetch
async function fetchArticles() {
  const { data } = await axios.get('/api/articles')  // ← Axios does HTTP
  return data  // ← React Query manages this in cache
}
```

Without React Query, every component would need its own loading/error state management and manual cache handling. Without Axios, every request would need manual header management and error handling.

## Architecture Overview

```
Backend Flow:
Controller → Form Request → Service → Repository → Database
                              ↓
                        Helpers & Adapters

News Fetching:
NewsService → Adapter Factory → Specific Adapter → External API
                                        ↓
                              ArticleTransformer
                                        ↓
                              CategoryHelper/AuthorHelper
                                        ↓
                              ArticleRepository
```

## Project Structure

```
news/
├── news-backend/
│   ├── app/
│   │   ├── Console/Commands/          # CLI commands
│   │   │   ├── FetchNewsCommand.php   # Main article fetcher
│   │   │   └── AddNewsSourceCommand.php
│   │   ├── Helpers/                   # Reusable utilities
│   │   │   ├── ArticleTransformer.php
│   │   │   ├── CategoryHelper.php
│   │   │   └── AuthorHelper.php
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Requests/              # Form validation
│   │   │   └── Resources/             # JSON responses
│   │   ├── Repositories/              # All DB queries here
│   │   └── Services/
│   │       ├── ArticleService.php
│   │       ├── AuthService.php
│   │       └── NewsAdapters/          # Adapter pattern
│   │           ├── AbstractNewsAdapter.php
│   │           ├── NewsApiAdapter.php
│   │           ├── GuardianAdapter.php
│   │           └── NYTAdapter.php
│   ├── config/news_sources.php        # API configurations
│   └── tests/                         # PHPUnit tests
│
├── news-frontend/
│   ├── src/
│   │   ├── app/                       # Next.js pages
│   │   ├── components/                # React components
│   │   ├── hooks/                     # Custom React Query hooks
│   │   ├── lib/
│   │   │   ├── queryKeys.ts           # Query key factories
│   │   │   └── api.ts                 # Axios instance
│   │   └── types/                     # TypeScript definitions
│   └── Dockerfile
│
└── docker-compose.yml
```

## Quick Start

**Prerequisites:**
- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- API keys (free tier):
  - [NewsAPI.org](https://newsapi.org/)
  - [The Guardian](https://open-platform.theguardian.com/)
  - [New York Times](https://developer.nytimes.com/)

**Setup:**

1. Clone and configure environment files:
```bash
# Root configuration for Docker Compose
cp .env.example .env

# Backend configuration
cp news-backend/.env.example news-backend/.env
# Edit news-backend/.env and add your API keys

# Frontend configuration
cp news-frontend/.env.local.example news-frontend/.env.local
```

2. Configure API keys in `news-backend/.env`:
```env
NEWSAPI_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key
NYT_API_KEY=your_nyt_key
```

3. Generate Laravel app key:
```bash
# Start MySQL first
docker-compose up -d mysql

# Generate and display the key
docker-compose run --rm backend php artisan key:generate --show

# Copy the output (e.g., base64:xxx...) and add it to news-backend/.env as APP_KEY
```

4. Install frontend dependencies locally (required for hot reloading):
```bash
cd news-frontend
npm ci
cd ..
```

5. Start all services:
```bash
docker-compose up -d --build
```

6. Set up database:
```bash
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
```

7. Fetch initial articles:
```bash
docker-compose exec backend php artisan news:fetch
```

8. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

**Development Mode:**

The setup runs Next.js in development mode with hot reloading enabled. Any changes to files in `news-frontend/src/` will automatically trigger a browser reload.

**Stopping Services:**
```bash
docker-compose down
```

**Viewing Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

## API Endpoints

**Auth:**
- `POST /api/register` - Create account
- `POST /api/login` - Get auth token
- `POST /api/logout` - Invalidate token

**Articles:**
- `GET /api/articles` - List with filters (source, category, author, date)
- `GET /api/articles/{id}` - Single article
- `GET /api/articles/search?q=keyword` - Search

**Personalization (authenticated):**
- `GET /api/feed/personalized` - Feed based on user preferences
- `GET /api/preferences` - Current preferences
- `PUT /api/preferences` - Update preferences

**Metadata:**
- `GET /api/sources` - All sources
- `GET /api/categories` - All categories

## Testing

I wrote comprehensive tests for both backend and frontend, covering all critical paths.

### Backend Tests (PHPUnit)

```bash
# Run all tests
docker exec -it news_backend php artisan test

# Specific test suites
docker exec -it news_backend php artisan test --testsuite=Unit
docker exec -it news_backend php artisan test --testsuite=Feature
```

**Coverage:**
- Unit Tests: Models (Article, User), Repositories, Services
- Feature Tests: Authentication flow, Article API endpoints, Personalized feed

Tests run on SQLite in-memory for speed. All tests complete in under 5 seconds.

### Frontend Tests (Vitest)

```bash
# Install dependencies (first time only)
cd news-frontend && npm install

# Run all frontend tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

**Coverage:**
- **useArticles**: Fetching, filtering, search, error handling
- **usePreferences**: Get/update preferences, cache invalidation
- **AuthContext**: Login, register, logout, token management

**Test Stack:**
- Vitest (fast test runner with TypeScript support)
- React Testing Library (testing hooks and components)
- Mocked API calls (fast, predictable, no network requests)

All frontend tests use isolated QueryClient instances to prevent cache pollution between tests.

## What I'd Improve With More Time

**Backend:**
- Add request rate limiting to prevent abuse
- Implement article deduplication (same story from different sources)
- Background jobs with Redis/Queue for news fetching
- More comprehensive error logging and monitoring
- API versioning for backwards compatibility

**Frontend:**
- Add infinite scroll instead of pagination
- Implement article bookmarking
- Add reading history
- Better error boundaries and fallback UIs
- Accessibility improvements (ARIA labels, keyboard navigation)
- Component tests for UI elements (currently only hook tests)
- E2E tests with Playwright

**DevOps:**
- GitHub Actions CI/CD pipeline
- Production-ready nginx config with caching
- Database backups and disaster recovery
- Monitoring (Sentry, DataDog, etc.)
- Load testing

## Design Patterns Used

- **Repository Pattern**: Abstracts data access
- **Service Layer**: Encapsulates business logic
- **Adapter Pattern**: Unifies multiple news APIs
- **Strategy Pattern**: Different extraction logic per source
- **Factory Pattern**: Dynamic adapter creation
- **Form Requests**: Centralized validation

## Why These Choices Matter

I could have built this as a simple CRUD app with API calls directly in controllers. That would have met the requirements. But I wanted to show how I think about real-world applications:

1. **Maintainability**: The next developer (or me in 6 months) should understand the code quickly
2. **Extensibility**: Adding a new news source takes minutes, not hours
3. **Testability**: Clean separation makes unit testing straightforward
4. **Performance**: Local storage + smart caching = fast user experience
5. **Best Practices**: SOLID principles aren't buzzwords - they genuinely make code better

## Tech Stack

**Backend:**
- Laravel 11 (PHP 8.2)
- MySQL 8.0
- Laravel Sanctum for auth
- Guzzle for HTTP requests

**Frontend:**
- Next.js 15 (App Router)
- TypeScript (strict mode)
- TanStack Query v5
- Tailwind CSS
- Axios

**DevOps:**
- Docker with multi-stage builds
- Docker Compose
- Nginx
- Supervisor for process management

## Notes for Reviewers

This took me about [4 /days] to build. I prioritized code quality and architecture over adding every possible feature. The codebase is documented, tested, and follows Laravel and React conventions.

If you have questions about any implementation decisions, I'm happy to discuss them. I made deliberate trade-offs and I can explain the reasoning behind each one.

---

Built by Amr Mohamed for innoscripta's full-stack developer challenge
