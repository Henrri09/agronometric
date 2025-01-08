import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Re-export everything
export * from '@testing-library/react';