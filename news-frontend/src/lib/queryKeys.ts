import { ArticleFilters } from '@/types/article';

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (page: number, filters?: ArticleFilters) =>
    [...articleKeys.lists(), { page, ...filters }] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: number) => [...articleKeys.details(), id] as const,
  search: (keyword: string, filters?: ArticleFilters) =>
    [...articleKeys.all, 'search', { keyword, ...filters }] as const,
  personalized: () => [...articleKeys.all, 'personalized'] as const,
  personalizedPage: (page: number) =>
    [...articleKeys.personalized(), { page }] as const,
};

export const sourceKeys = {
  all: ['sources'] as const,
  lists: () => [...sourceKeys.all, 'list'] as const,
  list: () => [...sourceKeys.lists()] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
};

export const preferenceKeys = {
  all: ['preferences'] as const,
  detail: () => [...preferenceKeys.all, 'detail'] as const,
};
