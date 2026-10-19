import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the TaskFlow welcome screen', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /welcome to taskflow/i })
  ).toBeInTheDocument();

  expect(
    screen.getByPlaceholderText(/enter your name/i)
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: /continue/i })
  ).toBeInTheDocument();
});
