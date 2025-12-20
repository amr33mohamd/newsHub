import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { preferenceKeys, articleKeys } from '@/lib/queryKeys';
import { UserPreference } from '@/types/user';

export function usePreferences() {
  return useQuery({
    queryKey: preferenceKeys.detail(),
    queryFn: async () => {
      const response = await api.get<UserPreference>('/preferences');
      return response.data;
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserPreference>) => {
      const response = await api.put('/preferences', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate preferences
      queryClient.invalidateQueries({ queryKey: preferenceKeys.all });

      // Invalidate ALL article queries (lists, personalized, search) since preferences changed
      // This will automatically refetch articles on the homepage and other pages
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}
