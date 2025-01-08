import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test-utils';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title and description correctly', () => {
    const title = 'Test Title';
    const description = 'Test Description';
    
    renderWithProviders(
      <PageHeader 
        title={title} 
        description={description}
      />
    );
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });
});