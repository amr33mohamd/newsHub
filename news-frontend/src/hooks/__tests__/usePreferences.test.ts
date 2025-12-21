import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePreferences, useUpdatePreferences } from '../usePreferences';
import { createWrapper, createTestQueryClient } from '@/test/utils';
import { articleKeys, preferenceKeys } from '@/lib/queryKeys';
import api from '@/lib/api';

vi.mock('@/lib/api');

describe('usePreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches user preferences successfully', async () => {
    const mockPreferences = {
      preferred_sources: [1, 2],
      preferred_categories: [3, 4],
      preferred_authors: [5],
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: { data: mockPreferences },
    });

    const { result } = renderHook(() => usePreferences(), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPreferences);
    expect(api.get).toHaveBeenCalledWith('/preferences');
  });

  it('handles empty preferences', async () => {
    const mockPreferences = {
      preferred_sources: [],
      preferred_categories: [],
      preferred_authors: [],
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: { data: mockPreferences },
    });

    const { result } = renderHook(() => usePreferences(), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.preferred_sources).toHaveLength(0);
  });
});

describe('useUpdatePreferences', () => {
  it('updates preferences successfully', async () => {
    const queryClient = createTestQueryClient();
    const updatedPreferences = {
      preferred_sources: [1, 2, 3],
      preferred_categories: [4, 5],
      preferred_authors: [],
    };

    vi.mocked(api.put).mockResolvedValueOnce({
      data: { data: updatedPreferences },
    });

    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createWrapper(queryClient),
    });

    // Trigger mutation
    result.current.mutate({
      preferred_sources: [1, 2, 3],
      preferred_categories: [4, 5],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(updatedPreferences);
    expect(api.put).toHaveBeenCalledWith('/preferences', {
      preferred_sources: [1, 2, 3],
      preferred_categories: [4, 5],
    });
  });

  it('invalidates preference and article queries on success', async () => {
    const queryClient = createTestQueryClient();

    // Spy on invalidateQueries
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const updatedPreferences = {
      preferred_sources: [1],
      preferred_categories: [2],
      preferred_authors: [],
    };

    vi.mocked(api.put).mockResolvedValueOnce({
      data: { data: updatedPreferences },
    });

    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ preferred_sources: [1] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify cache invalidation
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: preferenceKeys.all,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: articleKeys.all,
    });
  });

  it('handles update errors correctly', async () => {
    const error = new Error('Failed to update preferences');
    vi.mocked(api.put).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    result.current.mutate({ preferred_sources: [1] });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });

  it('allows partial updates', async () => {
    const updatedPreferences = {
      preferred_sources: [1, 2],
      preferred_categories: [],
      preferred_authors: [],
    };

    vi.mocked(api.put).mockResolvedValueOnce({
      data: { data: updatedPreferences },
    });

    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    // Only update sources
    result.current.mutate({ preferred_sources: [1, 2] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.put).toHaveBeenCalledWith('/preferences', {
      preferred_sources: [1, 2],
    });
  });
});
