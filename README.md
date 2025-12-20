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
- **NewsService**: Core service managing multiple API integrations with profile-based configuration
- **ArticleService**: Centralized business logic for article operations
- **Single Responsibility**: Each service has a focused, well-defined purpose
- **Reusability**: Services can be used across controllers, commands, and jobs

#### **Profile-Based Configuration**
- **Config-Driven Architecture**: API sources defined in `config/news_sources.php`
- **Scalability**: Add new news sources without code changes, just configuration
- **Field Mapping**: Dynamic transformation of different API responses to unified schema
- **Rate Limit Management**: Built-in rate limiting per API profile

```php
// Adding a new source is as simple as adding a config profile
'new_source' => [
    'name' => 'New News API',
    'base_url' => 'https://api.example.com/',
    'api_key' => env('NEW_SOURCE_KEY'),
    'field_mapping' => [/* mappings */],
]
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
│   │   ├── Console/Commands/      # CLI Commands (news:fetch)
│   │   ├── Http/Controllers/      # API Controllers
│   │   ├── Models/                # Eloquent Models
│   │   ├── Repositories/          # Repository Pattern Implementation
│   │   └── Services/              # Business Logic Services
│   ├── config/
│   │   └── news_sources.php       # Profile-Based API Configuration
│   ├── database/
│   │   ├── migrations/            # Database Schema
│   │   └── seeders/               # Database Seeders
│   │       ├── SourceSeeder.php   # Seeds news sources (NewsAPI, Guardian, NYT)
│   │       └── CategorySeeder.php # Seeds article categories
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

### 1. Dynamic API Integration
The `NewsService` uses a profile-based approach, allowing seamless integration of multiple APIs:

```php
// Fetch from any configured source
$this->newsService->fetchArticles('newsapi', [
    'category' => 'technology',
    'query' => 'AI'
]);

// Field mapping transforms different API responses to unified schema
'field_mapping' => [
    'title' => 'title',                    // Direct mapping
    'author' => 'author',                  // Simple field
    'published_at' => 'publishedAt',       // Different naming
]
```

### 2. Repository Pattern Benefits
Clean separation between data access and business logic:

```php
// Repository handles data access
class ArticleRepository {
    public function getAllArticles($filters, $perPage = 15)
    {
        return Article::with(['source', 'category', 'author'])
            ->when($filters['source_id'], ...)
            ->paginate($perPage);
    }
}

// Service uses repository for business logic
class ArticleService {
    public function __construct(
        private ArticleRepository $articleRepository
    ) {}
}
```

### 3. React Query Best Practices
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

## 🧪 Testing Ready

The architecture supports easy testing:
- **Repositories**: Can be mocked for service tests
- **Services**: Can be unit tested independently
- **Controllers**: Can be integration tested
- **Frontend Hooks**: React Query testing utilities compatible

## 🌟 Why This Project Stands Out

1. **Enterprise Architecture**: Not just a CRUD app, but production-ready architecture
2. **Scalability First**: Designed to handle growth from day one
3. **Clean Code**: Follows SOLID principles and industry best practices
4. **Modern Stack**: Latest versions of Laravel, Next.js, and supporting libraries
5. **Full Type Safety**: TypeScript throughout frontend
6. **Config-Driven**: Add features through configuration, not code changes
7. **Professional Patterns**: Repository, Service Layer, Query Key Factories
8. **Docker Ready**: Production-grade containerization
9. **Well Documented**: Comprehensive README and inline comments

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
