'use client';

import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { ArticleDetailSkeleton } from '@/components/articles/ArticleDetailSkeleton';
import { ArticleContent } from '@/components/articles/ArticleContent';
import { useArticle } from '@/hooks/useArticles';
import Link from 'next/link';
import { use } from 'react';

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: article, isLoading, error } = useArticle(Number(id));

  return (
    <>
      <FlashBanner />
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading && <ArticleDetailSkeleton />}

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Failed to load article. Please try again later.
            </div>
          )}

          {article && <ArticleContent article={article} />}

          <div className="mt-8">
            <Link
              href="/"
              className="text-[#E74C3C] hover:text-[#d44332] font-medium"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
