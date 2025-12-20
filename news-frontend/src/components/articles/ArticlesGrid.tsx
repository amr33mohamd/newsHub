import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

interface ArticlesGridProps {
  articles: Article[];
  featured?: boolean;
}

export function ArticlesGrid({ articles, featured = false }: ArticlesGridProps) {
  if (articles.length === 0) {
    return null;
  }

  // If featured mode, show first article as featured and rest in grid
  if (featured && articles.length > 0) {
    const featuredArticle = articles[0];
    const remainingArticles = articles.slice(1);

    return (
      <>
        <div className="mb-8">
          <ArticleCard article={featuredArticle} featured />
        </div>
        {remainingArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {remainingArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </>
    );
  }

  // Regular grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
