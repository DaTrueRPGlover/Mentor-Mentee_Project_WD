import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Log In heading and Mentee button', () => {
  render(<App />);
  
  // Get the Log In heading (role of "heading" with level 1)
  const loginHeading = screen.getByRole('heading', { level: 1, name: /log in/i });
  expect(loginHeading).toBeInTheDocument();

  // Get the Log In button (role of "button")
  const loginButton = screen.getByRole('button', { name: /log in/i });
  expect(loginButton).toBeInTheDocument();

  // Get the Mentee button by its text
  const menteeButton = screen.getByText(/mentee/i);
  expect(menteeButton).toBeInTheDocument();
});

