'use client';

import { useState, use, useCallback } from 'react';
import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { SearchBar } from '@/components/articles/SearchBar';
import { FilterBar } from '@/components/articles/FilterBar';
import { ArticlesGrid } from '@/components/articles/ArticlesGrid';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useSearchArticles } from '@/hooks/useArticles';
import type { ArticleFilters } from '@/types';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = use(searchParams);
  const keyword = q || '';
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ArticleFilters>({});

  const { data, isLoading, error } = useSearchArticles(keyword, page, filters);

  const handleFilterChange = useCallback((newFilters: ArticleFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const articles = data?.data || [];

  return (
    <>
      <FlashBanner />
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-[#E74C3C]">Search</span>{' '}
            <span className="text-gray-900">Results</span>
          </h1>
          {keyword && (
            <p className="text-gray-600 mb-8">
              Showing results for &quot;{keyword}&quot;
            </p>
          )}

          <div className="mb-8 space-y-4">
            <SearchBar initialValue={keyword} />
            <FilterBar onFilterChange={handleFilterChange} />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Failed to search articles. Please try again later.
            </div>
          )}

          {isLoading && <LoadingSkeleton count={6} />}

          {!isLoading && articles.length === 0 && (
            <EmptyState
              title="No articles found"
              message="Try different keywords or adjust your filters"
              icon="search"
            />
          )}

          {!isLoading && articles.length > 0 && (
            <ArticlesGrid articles={articles} />
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
