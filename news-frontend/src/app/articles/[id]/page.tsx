'use client';

import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { useArticle } from '@/hooks/useArticles';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { use } from 'react';
import DOMPurify from 'dompurify';

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
          {isLoading && (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
              <div className="h-96 bg-gray-300 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Failed to load article. Please try again later.
            </div>
          )}

          {article && (
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              {article.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-96 object-cover"
                />
              )}

              <div className="p-8">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {article.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {article.source && (
                      <span className="font-medium text-blue-600">
                        {article.source.name}
                      </span>
                    )}
                    {article.category && (
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {article.category.name}
                      </span>
                    )}
                    {article.author && (
                      <span>By {article.author.name}</span>
                    )}
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                </div>

                {article.description && (
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    {article.description}
                  </p>
                )}

                {article.content && (
                  <div
                    className="prose prose-lg max-w-none mb-8 text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(article.content)
                    }}
                  />
                )}

                <div className="border-t pt-6">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-[#E74C3C] text-white rounded-md hover:bg-[#d44332] transition-colors"
                  >
                    Read Full Article on {article.source?.name}
                  </a>
                </div>
              </div>
            </article>
          )}

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
