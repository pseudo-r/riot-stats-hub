
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('React Simple', () => {
  it('renders div', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
