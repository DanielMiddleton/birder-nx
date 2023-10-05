import { render, screen } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a file input', () => {
    render(<App />);
    expect(screen.getByLabelText(/bird image/i)).toBeTruthy();
  });
});
