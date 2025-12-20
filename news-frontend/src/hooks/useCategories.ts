import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { categoryKeys } from '@/lib/queryKeys';
import { Category } from '@/types/article';

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const response = await api.get<{ data: Category[] }>('/categories');
      return response.data.data;
    },
  });
}
