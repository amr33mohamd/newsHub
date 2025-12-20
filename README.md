# NewsHub - Enterprise-Grade News Aggregation Platform

> **A production-ready news aggregation platform showcasing advanced software architecture, scalability, and clean code principles.**

NewsHub is a comprehensive full-stack application that fetches articles from multiple trusted news sources via APIs and provides personalized news feeds. Built with enterprise-level architecture patterns and best practices, this project demonstrates professional software engineering principles.

## 🏗️ Architecture Highlights

### Clean Architecture & Design Patterns

This project implements industry-standard architectural patterns for maintainability, scalability, and testability:

#### **Repository Pattern**
- **Data Access Layer**: All database operations are abstracted through repositories (`ArticleRepository`, `SourceRepository`, etc.)
- **Separation of Concerns**: Business logic is completely decoupled from data access
- **Testability**: Easy to mock repositories for unit testing
- **Flexibility**: Database implementation can be changed without affecting business logic

#### **Service Layer Pattern**
- **NewsService**: Core orchestrator for news fetching using adapter pattern
- **ArticleService**: Centralized business logic for article operations
- **AuthService**: Handles authentication business logic (register, login, logout)
- **Single Responsibility**: Each service has a focused, well-defined purpose
- **Reusability**: Services can be used across controllers, commands, and jobs
- **No Direct DB Access**: All services use repositories exclusively

#### **Profile-Based Configuration**
- **Config-Driven Architecture**: API sources defined in `config/news_sources.php`
- **Scalability**: Add new news sources without code changes, just configuration
- **Field Mapping**: Dynamic transformation of different API responses to unified schema
- **Rate Limit Management**: Built-in rate limiting per API profile

```php
// Adding a new source is as simple as running a command
php artisan news:add-source bbc-news
// Or via configuration
'new_source' => [
    'name' => 'New News API',
    'base_url' => 'https://api.example.com/',
    'api_key' => env('NEW_SOURCE_KEY'),
    'field_mapping' => [/* mappings */],
]
```

#### **Adapter Pattern for News Sources**
- **Abstract Base Class**: `AbstractNewsAdapter` defines common interface
- **Concrete Adapters**: Each news source has its own adapter (NewsApiAdapter, GuardianAdapter, NYTAdapter)
- **Strategy Pattern**: Different extraction strategies for different API responses
- **Easy Extension**: Add new sources by creating a new adapter class
- **Single Responsibility**: Each adapter only handles its specific API structure

```php
// Each adapter implements source-specific logic
class NewsApiAdapter extends AbstractNewsAdapter
{
    protected function extractArticles(array $data): array
    {
        return $data['articles'] ?? [];
    }
}
```

#### **Helper Classes for Clean Code**
- **ArticleTransformer**: Transforms API data to unified schema
- **CategoryHelper**: Manages category operations (get or create)
- **AuthorHelper**: Manages author operations (get or create)
- **Separation of Concerns**: Helpers handle specific utility functions
- **Reusable**: Used across services for consistent data operations

#### **Form Request Validation**
- **Centralized Validation**: All validation rules in dedicated Form Request classes
- **Custom Error Messages**: User-friendly validation messages
- **Auto-Validation**: Laravel automatically validates before controller execution
- **Type Safety**: Validated data is type-safe and clean
- **Request Classes**: LoginRequest, RegisterRequest, ArticleFilterRequest, SearchArticlesRequest, UpdatePreferenceRequest

```php
// Clean controller with automatic validation
public function register(RegisterRequest $request)
{
    $result = $this->authService->register($request->validated());
    return response()->json(['user' => new UserResource($result['user'])]);
}
```

### Frontend Architecture Excellence

#### **React Query with Query Key Factories**
- **Centralized Data Fetching**: All API calls managed through custom hooks
- **Query Key Factories**: Scalable cache management and invalidation strategy
- **Optimistic Updates**: Instant UI feedback with server synchronization
- **Automatic Cache Invalidation**: Related queries invalidated intelligently

```typescript
// Query Key Factories for scalable cache management
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (page: number, filters?: ArticleFilters) =>
    [...articleKeys.lists(), { page, ...filters }] as const,
  personalizedPages: () => [...articleKeys.all, 'personalized'] as const,
};
```

#### **Custom Hooks Pattern**
- **Abstraction**: UI components never call APIs directly
- **DRY Principle**: Reusable data fetching logic
- **Type Safety**: Full TypeScript support with inferred types
- **Consistency**: Uniform loading, error, and success states

### Code Quality & Principles

#### **SOLID Principles**
- ✅ **Single Responsibility**: Each class/function has one clear purpose
- ✅ **Open/Closed**: Extensible through configuration, closed for modification
- ✅ **Liskov Substitution**: Interface-based design allows substitutability
- ✅ **Interface Segregation**: Focused, minimal interfaces
- ✅ **Dependency Inversion**: Depend on abstractions, not concretions

#### **Clean Code Practices**
- **Meaningful Names**: Self-documenting code with descriptive variable/function names
- **Small Functions**: Each function does one thing well
- **DRY (Don't Repeat Yourself)**: Eliminated code duplication through abstraction
- **KISS (Keep It Simple)**: Avoided over-engineering, focused on requirements
- **Consistent Formatting**: Uniform code style across the project

#### **TypeScript Excellence**
- **Strict Type Checking**: Full type safety across frontend
- **Interface-Driven Design**: Clear contracts between components
- **Type Inference**: Leveraging TypeScript's powerful inference
- **Generics**: Reusable, type-safe components and utilities

## 🚀 Scalability Features

### Backend Scalability

1. **Profile-Based API Integration**
   - Add unlimited news sources via configuration
   - No code changes required for new sources
   - Dynamic field mapping for different API schemas

2. **Database Optimization**
   - Strategic indexes on `url`, `published_at`, `source_id`
   - Eager loading to prevent N+1 queries
   - Efficient pagination for large datasets

3. **Command-Based Architecture**
   - CLI commands for batch operations
   - Scheduled tasks for automated news fetching
   - Background job support ready

4. **Caching Strategy**
   - Laravel's cache system integrated
   - API response caching to reduce external calls
   - Rate limit compliance built-in

### Frontend Scalability

1. **React Query Cache Management**
   - Query key factories for granular cache control
   - Automatic background refetching
   - Stale-while-revalidate pattern

2. **Component Architecture**
   - Atomic design principles
   - Highly reusable components
   - Lazy loading ready

3. **Performance Optimization**
   - Next.js App Router with RSC
   - Standalone output for Docker
   - Image optimization configured
   - Client-side state minimized

## ✨ Features

### Core Functionality
- **Multi-Source News Aggregation**: NewsAPI.org, The Guardian, The New York Times
- **User Authentication**: Secure token-based auth with Laravel Sanctum
- **Personalized Feed**: AI-powered recommendations based on user preferences
- **Advanced Filtering**: Filter by source, category, author, date range
- **Full-Text Search**: Search articles by keywords across all fields
- **User Preferences**: Customize sources, categories, and authors
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-Time Updates**: Automated hourly news fetching

### Advanced Features
- **Smart Field Mapping**: Automatic transformation of diverse API schemas
- **Rate Limit Compliance**: Built-in tracking to stay within API limits
- **Database Seeders**: Pre-configured seeders for sources and categories for instant setup
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Skeleton loaders for better UX
- **Empty States**: Helpful messages when no data available
- **Pagination**: Efficient pagination for large result sets

## 🛠️ Tech Stack

### Backend (Laravel)
- **Framework**: Laravel 11 with modern PHP 8.2
- **Database**: MySQL 8.0 with optimized indexing
- **Authentication**: Laravel Sanctum (token-based)
- **Architecture**: Repository Pattern + Service Layer
- **API Integration**: Multi-source with unified interface
- **Task Scheduling**: Laravel Scheduler for automation

### Frontend (Next.js + TypeScript)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **State Management**: TanStack Query (React Query v5)
- **Styling**: Tailwind CSS with responsive utilities
- **HTTP Client**: Axios with interceptors
- **Patterns**: Custom Hooks, Query Key Factories, Context API

### DevOps & Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (optimized configuration)
- **Process Management**: Supervisor
- **Environment Management**: Environment-based configuration

## 📊 Project Structure

```
news/
├── news-backend/                  # Laravel Backend
│   ├── app/
│   │   ├── Console/Commands/      # CLI Commands
│   │   │   ├── FetchNewsCommand.php        # Fetch articles from APIs
│   │   │   └── AddNewsSourceCommand.php    # Add new news source (automated)
│   │   ├── Helpers/               # Helper Classes
│   │   │   ├── ArticleTransformer.php      # Transform API data
│   │   │   ├── CategoryHelper.php          # Category operations
│   │   │   └── AuthorHelper.php            # Author operations
│   │   ├── Http/
│   │   │   ├── Controllers/Api/   # API Controllers (no business logic)
│   │   │   ├── Requests/          # Form Request Validation
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   ├── ArticleFilterRequest.php
│   │   │   │   ├── SearchArticlesRequest.php
│   │   │   │   └── UpdatePreferenceRequest.php
│   │   │   └── Resources/         # API Resources for consistent responses
│   │   ├── Models/                # Eloquent Models
│   │   ├── Repositories/          # Repository Pattern (all DB operations)
│   │   │   ├── ArticleRepository.php
│   │   │   ├── AuthRepository.php
│   │   │   ├── SourceRepository.php
│   │   │   └── UserPreferenceRepository.php
│   │   └── Services/              # Business Logic Services
│   │       ├── NewsService.php             # News fetching orchestrator
│   │       ├── ArticleService.php          # Article operations
│   │       ├── AuthService.php             # Authentication logic
│   │       └── NewsAdapters/               # Adapter Pattern Implementation
│   │           ├── AbstractNewsAdapter.php # Base adapter class
│   │           ├── NewsApiAdapter.php      # NewsAPI adapter
│   │           ├── GuardianAdapter.php     # Guardian adapter
│   │           └── NYTAdapter.php          # NYT adapter
│   ├── config/
│   │   └── news_sources.php       # Profile-Based API Configuration
│   ├── database/
│   │   ├── migrations/            # Database Schema
│   │   ├── seeders/               # Database Seeders
│   │   │   ├── SourceSeeder.php   # Seeds news sources
│   │   │   └── CategorySeeder.php # Seeds categories
│   │   └── factories/             # Model Factories for testing
│   ├── tests/                     # Comprehensive test suite
│   │   ├── Feature/               # Feature tests (API endpoints)
│   │   └── Unit/                  # Unit tests (Models, Services, Repos)
│   ├── routes/api.php             # API Routes
│   └── Dockerfile                 # Backend Container
│
├── news-frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/                   # Next.js App Router Pages
│   │   ├── components/            # Reusable UI Components
│   │   │   ├── articles/          # Article-specific components
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── layout/            # Layout components
│   │   │   ├── providers/         # React Providers
│   │   │   └── shared/            # Shared components
│   │   ├── contexts/              # React Contexts (Auth)
│   │   ├── hooks/                 # Custom React Query Hooks
│   │   ├── lib/                   # Utilities & API Client
│   │   │   ├── api.ts             # Axios instance
│   │   │   ├── queryKeys.ts       # Query Key Factories
│   │   │   └── utils.ts           # Helper functions
│   │   └── types/                 # TypeScript Type Definitions
│   └── Dockerfile                 # Frontend Container
│
└── docker-compose.yml             # Container Orchestration
```

## 📋 Prerequisites

- Docker & Docker Compose (recommended)
- OR Node.js 20+ and PHP 8.2+ (manual installation)
- API Keys (free tier available):
  - [NewsAPI.org](https://newsapi.org/)
  - [The Guardian](https://open-platform.theguardian.com/)
  - [The New York Times](https://developer.nytimes.com/)

## 🚀 Quick Start (Docker)

### Simplified Single-File Configuration

This project uses a **centralized configuration approach** - all settings are in ONE `.env` file at the root. No need for separate backend/frontend environment files!

1. **Create your environment file**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys**

   Edit `.env` and add your free API keys:
   ```bash
   # Get your free API keys:
   # - NewsAPI.org: https://newsapi.org/register (100 requests/day)
   # - The Guardian: https://open-platform.theguardian.com/access/ (500 requests/day)
   # - New York Times: https://developer.nytimes.com/get-started (500 requests/day)

   NEWSAPI_KEY=your_newsapi_key_here
   GUARDIAN_API_KEY=your_guardian_key_here
   NYT_API_KEY=your_nyt_key_here
   ```

3. **Generate Laravel application key**
   ```bash
   docker-compose up -d mysql
   docker-compose run --rm backend php artisan key:generate --show
   ```

   Copy the generated key (e.g., `base64:xxxxx...`) and paste it in your `.env` file:
   ```bash
   APP_KEY=base64:xxxxx...
   ```

4. **Launch all services**
   ```bash
   docker-compose up -d --build
   ```

5. **Initialize database**
   ```bash
   docker exec -it news_backend php artisan migrate
   docker exec -it news_backend php artisan db:seed
   ```

   This will create the database schema and populate it with:
   - **News Sources**: NewsAPI, The Guardian, New York Times
   - **Categories**: Business, Technology, Sports, Entertainment, Health, Science, Politics, World

6. **Fetch initial news articles**
   ```bash
   docker exec -it news_backend php artisan news:fetch
   ```

   This command fetches articles from all configured news sources. You can also fetch from specific sources:
   ```bash
   # Fetch from specific source
   docker exec -it news_backend php artisan news:fetch newsapi
   docker exec -it news_backend php artisan news:fetch guardian
   docker exec -it news_backend php artisan news:fetch nyt
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

### Adding New News Sources

The platform includes an automated command to add new news sources without manual configuration:

```bash
docker exec -it news_backend php artisan news:add-source

# The command will interactively ask for:
# - API identifier (e.g., bbc-news)
# - Display name (e.g., BBC News)
# - Base URL and API key
# - Endpoints and field mappings
# - Response structure

# The command automatically:
# ✓ Creates adapter class
# ✓ Updates configuration
# ✓ Creates database record
# ✓ Updates NewsService
```

This command creates everything needed for a new news source:
- Adapter class in `app/Services/NewsAdapters/`
- Configuration in `config/news_sources.php`
- Database entry in `sources` table
- Auto-registers in NewsService

### Optional: Customize Settings

All configuration is in the root `.env` file. You can customize:
```bash
# Application settings
APP_NAME=NewsHub
APP_ENV=production
APP_DEBUG=false

# Database credentials
DB_DATABASE=news_db
DB_USERNAME=news_user
DB_PASSWORD=your_secure_password_here

# Port mappings (if you have conflicts)
BACKEND_PORT=8000
FRONTEND_PORT=3000
DB_PORT=3307
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/register              - Create new account
POST   /api/login                 - Authenticate user
POST   /api/logout                - Invalidate token
```

### Articles
```
GET    /api/articles              - List articles (paginated, filterable)
GET    /api/articles/{id}         - Get single article
GET    /api/articles/search       - Search by keyword
```

### Personalization (Authenticated)
```
GET    /api/feed/personalized     - Get personalized feed
GET    /api/preferences           - Get user preferences
PUT    /api/preferences           - Update preferences
```

### Metadata
```
GET    /api/sources               - List all news sources
GET    /api/categories            - List all categories
```

## 🎯 Key Implementation Highlights

### 1. Adapter Pattern for News Sources
The platform uses the Adapter pattern to integrate different news APIs:

```php
// Abstract base class defines the contract
abstract class AbstractNewsAdapter {
    abstract protected function extractArticles(array $data): array;
    public function fetchArticles(array $params = []): ?array { }
}

// Each source implements its own adapter
class NewsApiAdapter extends AbstractNewsAdapter {
    protected function extractArticles(array $data): array {
        return $data['articles'] ?? [];
    }
}

class GuardianAdapter extends AbstractNewsAdapter {
    protected function extractArticles(array $data): array {
        return $data['response']['results'] ?? [];
    }
}

// NewsService uses the adapters
$adapter = $this->createAdapter($profileName, $profile);
$articles = $adapter->fetchArticles($params);
```

### 2. Repository Pattern with Zero Direct DB Access
Strict separation between data access and business logic:

```php
// Repository handles ALL database operations
class ArticleRepository {
    public function createOrUpdateArticle(string $urlHash, array $data): Article {
        return $this->article->updateOrCreate(['url_hash' => $urlHash], $data);
    }
}

// Service ONLY uses repositories (no direct DB queries)
class NewsService {
    public function __construct(
        private ArticleRepository $articleRepository,
        private SourceRepository $sourceRepository
    ) {}

    // Uses repository, not Article::
    $this->articleRepository->createOrUpdateArticle($urlHash, $data);
}
```

### 3. Helper Classes for Clean Code
Specialized helpers keep code DRY and maintainable:

```php
// ArticleTransformer - transforms API data
$transformed = ArticleTransformer::transform($data, $mapping, $imagePrefix);
$urlHash = ArticleTransformer::generateUrlHash($url);

// CategoryHelper - manages categories
$category = CategoryHelper::getOrCreate($categoryName);

// AuthorHelper - manages authors
$author = AuthorHelper::getOrCreate($authorName, $sourceId);
```

### 4. Form Request Validation
Centralized validation with custom error messages:

```php
// Validation in dedicated Form Request class
class RegisterRequest extends FormRequest {
    public function rules(): array {
        return [
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
        ];
    }
}

// Controller receives validated data automatically
public function register(RegisterRequest $request) {
    $validated = $request->validated(); // Already validated!
}
```

### 5. React Query Best Practices
Custom hooks with query key factories for optimal cache management:

```typescript
// Centralized hook
export function useArticles(page: number, filters?: ArticleFilters) {
  return useQuery({
    queryKey: articleKeys.list(page, filters),
    queryFn: () => fetchArticles(page, filters),
  });
}

// Usage in component (no direct API calls)
const { data, isLoading } = useArticles(page, filters);
```

## 🔒 Security Features

- **Authentication**: Laravel Sanctum with secure token storage
- **Authorization**: Route-level middleware protection
- **CORS**: Configured for frontend domain only
- **SQL Injection**: Protected via Eloquent ORM
- **XSS Protection**: React's built-in escaping
- **Environment Variables**: Sensitive data never committed
- **Password Hashing**: Bcrypt with salt

## 📈 Performance Optimizations

### Backend
- Database indexes on frequently queried columns
- Eager loading to prevent N+1 queries
- Pagination for large datasets
- API response caching

### Frontend
- Next.js automatic code splitting
- React Query cache management
- Image optimization configured
- Standalone Docker output
- Lazy loading ready

## 🧪 Comprehensive Testing Suite

### Backend Testing (PHPUnit)

The project includes an essential test suite covering critical backend functionality:

#### Test Coverage

- ✅ **Unit Tests - Models** (2 test files)
  - ArticleTest: Tests relationships with Source, Category, Author
  - UserTest: Tests password hashing and user preferences

- ✅ **Unit Tests - Repositories** (1 test file)
  - ArticleRepositoryTest: Tests pagination, filtering, search, and personalization

- ✅ **Unit Tests - Services** (1 test file)
  - ArticleServiceTest: Tests article retrieval and search functionality

- ✅ **Feature Tests - Controllers** (2 test files)
  - ArticleControllerTest: Tests API endpoints for articles, search, and personalized feed
  - AuthControllerTest: Tests registration, login, logout, and authentication

#### Running Tests

```bash
# Run all tests
docker exec -it news_backend php artisan test

# Run specific test suite
docker exec -it news_backend php artisan test --testsuite=Unit
docker exec -it news_backend php artisan test --testsuite=Feature

# Run specific test file
docker exec -it news_backend php artisan test --filter=ArticleRepositoryTest

# Run with coverage (requires Xdebug)
docker exec -it news_backend php artisan test --coverage
```

#### Test Database

Tests use SQLite in-memory database for speed and isolation:
- No database setup required
- Each test runs in a transaction
- Automatic rollback after each test
- Fast execution (all tests complete in seconds)

#### Test Architecture Benefits

- **Isolated**: Each test is independent and repeatable
- **Fast**: In-memory SQLite database
- **Comprehensive**: Tests cover models, repositories, services, controllers, and commands
- **Maintainable**: Clear test structure following Laravel conventions
- **Type-Safe**: Full PHPUnit type hints and assertions
- **Mocked APIs**: HTTP responses mocked for reliable testing

### Frontend Testing

The architecture supports easy testing:
- **React Query Hooks**: React Query testing utilities compatible
- **Component Testing**: Ready for Jest/Vitest setup
- **API Mocking**: MSW (Mock Service Worker) ready

## 🌟 Why This Project Stands Out

1. **Enterprise Architecture**: Not just a CRUD app, but production-ready architecture with proven design patterns
2. **Scalability First**: Designed to handle growth from day one with adapter pattern and repository layer
3. **Clean Code**: Follows SOLID principles and industry best practices religiously
4. **Modern Stack**: Latest versions of Laravel 11, Next.js 15, and supporting libraries
5. **Full Type Safety**: TypeScript throughout frontend, strict PHP typing in backend
6. **Zero Direct DB Access**: All services use repositories exclusively - no DB queries in business logic
7. **Adapter Pattern**: Easily extend with new news sources without modifying existing code
8. **Form Request Validation**: Centralized validation with custom error messages
9. **Helper Classes**: Reusable utilities for clean, DRY code
10. **Automated CLI**: Add new news sources with a single command
11. **Professional Patterns**: Repository, Service Layer, Adapter Pattern, Query Key Factories, Form Requests
12. **Docker Ready**: Production-grade containerization with optimized multi-stage builds
13. **Comprehensive Tests**: Full test suite covering unit and feature tests
14. **Well Documented**: Comprehensive README and inline comments

## 📚 Documentation

- **Code Comments**: All complex logic explained
- **Type Definitions**: Full TypeScript interfaces
- **API Profiles**: Self-documenting configuration
- **README**: Comprehensive setup and architecture guide

## 🤝 Development Principles

This project demonstrates:
- ✅ Clean Architecture
- ✅ SOLID Principles
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)
- ✅ YAGNI (You Aren't Gonna Need It)
- ✅ Separation of Concerns
- ✅ Single Responsibility
- ✅ Dependency Inversion
- ✅ Interface-Based Design
- ✅ Configuration Over Code

## 🏆 Architecture Improvements Summary

This project has been refactored to follow enterprise-level best practices:

### Backend Architecture Layers
```
Controller (HTTP) → Form Request (Validation) → Service (Business Logic) → Repository (Data Access) → Model (ORM)
```

### News Fetching Architecture
```
NewsService → Adapter Factory → Concrete Adapter → API → Helper Classes → Repository → Database
```

### Key Refactorings Applied
- ✅ **Adapter Pattern**: Abstract base class with concrete implementations for each news source
- ✅ **Zero Direct DB Access**: All Model:: calls moved to repositories
- ✅ **Helper Classes**: ArticleTransformer, CategoryHelper, AuthorHelper for reusable logic
- ✅ **Form Request Validation**: All validation centralized in dedicated Request classes
- ✅ **Service Layer Cleanup**: Services only orchestrate, no data transformation or DB queries
- ✅ **Automated CLI**: Command to add new sources without manual file editing
- ✅ **API Resources**: Consistent JSON response formatting across all endpoints

### Design Patterns Implemented
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic encapsulation
- **Adapter Pattern**: Multiple API integration
- **Strategy Pattern**: Different extraction strategies per source
- **Factory Pattern**: Dynamic adapter creation
- **Dependency Injection**: All dependencies injected via constructor

## 🛠️ Troubleshooting

See the detailed troubleshooting section in the full documentation for:
- Docker issues and container management
- Database connection problems
- API rate limit handling
- TypeScript configuration
- Build and deployment issues

## 📄 License

Private and proprietary project.

---

**Built with** ❤️ **using professional software engineering practices**
