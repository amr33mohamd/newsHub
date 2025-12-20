import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { sourceKeys } from '@/lib/queryKeys';
import { Source } from '@/types/article';

export function useSources() {
  return useQuery({
    queryKey: sourceKeys.list(),
    queryFn: async () => {
      const response = await api.get<Source[]>('/sources');
      return response.data;
    },
  });
}
