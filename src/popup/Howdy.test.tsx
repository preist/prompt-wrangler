import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Howdy from './Howdy';

describe('Howdy', () => {
  it('renders the title with cowboy emoji', () => {
    render(<Howdy />);
    const title = screen.getByText(/🤠 Howdy, Partner!/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Howdy />);
    const subtitle = screen.getByText(/Prompt Wrangler/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Howdy />);
    const tagline = screen.getByText(/Keepin' your secrets safe/i);
    expect(tagline).toBeInTheDocument();
  });

  it('has correct dimensions', () => {
    const { container } = render(<Howdy />);
    const howdyElement = container.querySelector('.howdy');
    expect(howdyElement).toBeInTheDocument();
  });
});
