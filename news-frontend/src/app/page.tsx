'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { FilterBar } from '@/components/articles/FilterBar';
import { SearchBar } from '@/components/articles/SearchBar';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Pagination } from '@/components/shared/Pagination';
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
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <>
      <FlashBanner />
      <Navbar currentCategoryId={filters.category_id} />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-[#E74C3C]">Today&apos;s</span>{' '}
              <span className="text-gray-900">News</span>
            </h1>
            {user ? (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <p className="text-gray-600">
                  Personalized news feed based on your preferences •{' '}
                  <a href="/preferences" className="text-[#E74C3C] hover:text-[#d44332] font-semibold transition-colors">
                    Update Preferences
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                Latest news from all sources •{' '}
                <a href="/login" className="text-[#E74C3C] hover:text-[#d44332] font-semibold transition-colors">
                  Login for personalized feed
                </a>
              </p>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <SearchBar />
            <FilterBar onFilterChange={handleFilterChange} currentFilters={filters} />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Failed to load articles. Please try again later.
            </div>
          )}

          {/* Featured Article */}
          {!isLoading && featuredArticle && (
            <div className="mb-8">
              <ArticleCard article={featuredArticle} featured />
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

          {/* Articles Grid */}
          {!isLoading && remainingArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {remainingArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* No Articles */}
          {!isLoading && articles.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="mt-4 text-lg text-gray-600">No articles found</p>
              <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search query</p>
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

export default function HomePage() {
  return (
    <Suspense fallback={
      <>
        <FlashBanner />
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    }>
      <HomePageContent />
    </Suspense>
  );
}
