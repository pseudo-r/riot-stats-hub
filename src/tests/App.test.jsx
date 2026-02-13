
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Check for a basic element that should always be there, e.g., Navbar links
    expect(screen.getByText(/RIOT STATS HUB/i)).toBeInTheDocument();
  });
});
