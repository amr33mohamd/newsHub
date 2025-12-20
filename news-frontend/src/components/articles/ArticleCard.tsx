import Link from 'next/link';
import { Article } from '@/types/article';
import { formatDate } from '@/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Link href={`/articles/${article.id}`} className="block group">
        <div className="grid md:grid-cols-2 gap-6 bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-64 md:h-full">
            {article.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col justify-center">
            {article.category && (
              <span className="inline-block px-3 py-1 bg-[#E74C3C] text-white text-xs font-bold uppercase rounded mb-3 w-fit">
                {article.category.name}
              </span>
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#E74C3C] transition-colors">
              {article.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
              {article.author && (
                <>
                  <span>•</span>
                  <span>by {article.author.name}</span>
                </>
              )}
            </div>
            {article.description && (
              <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                {article.description}
              </p>
            )}
            <span className="text-[#E74C3C] font-medium uppercase text-sm">READ MORE</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative h-48">
          {article.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {article.category && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-[#E74C3C] text-white text-xs font-bold uppercase rounded">
              {article.category.name}
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E74C3C] transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
            {article.author && (
              <>
                <span>•</span>
                <span>by {article.author.name}</span>
              </>
            )}
          </div>
          {article.description && (
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mb-3 flex-1">
              {article.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
