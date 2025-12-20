import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { articleKeys } from '@/lib/queryKeys';
import { buildArticleParams } from '@/lib/utils';
import { PaginatedArticles, ArticleFilters, Article } from '@/types/article';

export function useArticles(page = 1, filters?: ArticleFilters) {
  return useQuery({
    queryKey: articleKeys.list(page, filters),
    queryFn: async () => {
      const response = await api.get<PaginatedArticles>('/articles', {
        params: buildArticleParams(page, filters),
      });
      return response.data;
    },
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Article>(`/articles/${id}`);
      return response.data;
    },
  });
}

export function useSearchArticles(keyword: string, page = 1, filters?: ArticleFilters) {
  return useQuery({
    queryKey: articleKeys.search(keyword, filters),
    queryFn: async () => {
      const response = await api.get<PaginatedArticles>('/articles/search', {
        params: buildArticleParams(page, { ...filters, keyword }),
      });
      return response.data;
    },
    enabled: keyword.length > 0,
  });
}

export function usePersonalizedFeed(page = 1, enabled = true) {
  return useQuery({
    queryKey: articleKeys.personalizedPage(page),
    queryFn: async () => {
      const response = await api.get<PaginatedArticles>('/articles/personalized', {
        params: { page, per_page: 12 },
      });
      return response.data;
    },
    enabled,
  });
}
