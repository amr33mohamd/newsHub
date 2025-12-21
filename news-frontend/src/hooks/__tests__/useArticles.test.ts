import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useArticles, useArticle, useSearchArticles } from '../useArticles';
import { createWrapper, createTestQueryClient } from '@/test/utils';
import api from '@/lib/api';

// Mock the api module
vi.mock('@/lib/api');

describe('useArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches articles successfully', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          title: 'Test Article',
          description: 'Test Description',
          url: 'https://example.com/article',
          published_at: '2024-01-01',
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 1,
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useArticles(1), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith('/articles', {
      params: { page: 1, per_page: 12 },
    });
  });

  it('applies filters correctly', async () => {
    const mockData = {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const filters = {
      source_id: 1,
      category_id: 2,
      from_date: '2024-01-01',
      to_date: '2024-01-31',
    };

    renderHook(() => useArticles(1, filters), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/articles', {
        params: {
          page: 1,
          per_page: 12,
          source_id: 1,
          category_id: 2,
          from_date: '2024-01-01',
          to_date: '2024-01-31',
        },
      });
    });
  });

  it('handles errors correctly', async () => {
    const error = new Error('Network error');
    vi.mocked(api.get).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useArticles(1), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});

describe('useArticle', () => {
  it('fetches single article by id', async () => {
    const mockArticle = {
      id: 1,
      title: 'Test Article',
      description: 'Test Description',
      url: 'https://example.com/article',
      published_at: '2024-01-01',
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: { data: mockArticle },
    });

    const { result } = renderHook(() => useArticle(1), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockArticle);
    expect(api.get).toHaveBeenCalledWith('/articles/1');
  });
});

describe('useSearchArticles', () => {
  it('searches articles by keyword', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          title: 'Laravel Article',
          description: 'About Laravel',
          url: 'https://example.com/laravel',
          published_at: '2024-01-01',
        },
      ],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 1 },
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useSearchArticles('Laravel', 1), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith('/articles/search', {
      params: {
        page: 1,
        per_page: 12,
        keyword: 'Laravel',
      },
    });
  });

  it('does not fetch when keyword is empty', async () => {
    // Clear any previous mock calls
    vi.clearAllMocks();

    const { result } = renderHook(() => useSearchArticles('', 1), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    // Wait a bit to ensure no query was triggered
    await new Promise(resolve => setTimeout(resolve, 100));

    // Query should be disabled
    expect(result.current.status).toBe('pending');
    expect(result.current.fetchStatus).toBe('idle');
    // Should not have called the API
    expect(vi.mocked(api.get)).not.toHaveBeenCalled();
  });

  it('applies filters along with keyword', async () => {
    const mockData = {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const filters = { source_id: 1, category_id: 2 };

    renderHook(() => useSearchArticles('test', 1, filters), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/articles/search', {
        params: {
          page: 1,
          per_page: 12,
          keyword: 'test',
          source_id: 1,
          category_id: 2,
        },
      });
    });
  });
});
