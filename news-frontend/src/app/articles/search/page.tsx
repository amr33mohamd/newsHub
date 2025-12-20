'use client';

import { useState, use, useCallback } from 'react';
import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { SearchBar } from '@/components/articles/SearchBar';
import { FilterBar } from '@/components/articles/FilterBar';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Pagination } from '@/components/shared/Pagination';
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

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && articles.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-4 text-lg text-gray-600">No articles found</p>
              <p className="mt-2 text-sm text-gray-500">Try different keywords or adjust your filters</p>
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.last_page > 1 && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      </main>
    </>
  );
}
