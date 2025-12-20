'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { FilterBar } from '@/components/articles/FilterBar';
import { SearchBar } from '@/components/articles/SearchBar';
import { PageHeader } from '@/components/articles/PageHeader';
import { ArticlesGrid } from '@/components/articles/ArticlesGrid';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useArticles } from '@/hooks/useArticles';
import { useAuth } from '@/hooks/useAuth';
import type { ArticleFilters } from '@/types';

function HomePageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ArticleFilters>({});

  // Initialize filters from URL params
  useEffect(() => {
    const categoryId = searchParams.get('category_id');
    const sourceId = searchParams.get('source_id');

    setFilters({
      category_id: categoryId ? Number(categoryId) : undefined,
      source_id: sourceId ? Number(sourceId) : undefined,
    });
  }, [searchParams]);

  // Backend automatically returns personalized articles if logged in
  const { data, isLoading, error } = useArticles(page, filters);

  const handleFilterChange = useCallback((newFilters: ArticleFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const articles = data?.data || [];

  return (
    <>
      <FlashBanner />
      <Navbar currentCategoryId={filters.category_id} />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            user={user}
            title="Today's"
            subtitle="News"
          />

          <div className="mb-8 space-y-4">
            <SearchBar />
            <FilterBar onFilterChange={handleFilterChange} currentFilters={filters} />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Failed to load articles. Please try again later.
            </div>
          )}

          {isLoading && <LoadingSkeleton count={6} />}

          {!isLoading && articles.length === 0 && (
            <EmptyState
              title="No articles found"
              message="Try adjusting your filters or search query"
            />
          )}

          {!isLoading && articles.length > 0 && (
            <ArticlesGrid articles={articles} featured />
          )}

          {data && data.meta.last_page > 1 && (
            <Pagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      </main>
    </>
  );
}

function HomePageSkeleton() {
  return (
    <>
      <FlashBanner />
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-1/3 mb-8"></div>
            <LoadingSkeleton count={6} />
          </div>
        </div>
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
