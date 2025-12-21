import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient for each test to ensure isolation
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        gcTime: 0, // Disable cache persistence
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

// Wrapper component with QueryClientProvider
export function createWrapper(queryClient: QueryClient = createTestQueryClient()) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

// Custom render function with QueryClient wrapper
export function renderWithQueryClient(
  ui: ReactElement,
  queryClient: QueryClient = createTestQueryClient(),
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: createWrapper(queryClient),
    ...options,
  });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithQueryClient as render };
