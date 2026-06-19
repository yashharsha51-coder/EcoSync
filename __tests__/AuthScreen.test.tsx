import { render, screen, fireEvent } from '@testing-library/react';
import { AuthScreen } from '../components/AuthScreen';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn()
}));

jest.mock('../lib/firebase', () => ({
  auth: {},
  googleProvider: {}
}));

describe('AuthScreen Component', () => {
  it('renders the login prompt', () => {
    render(<AuthScreen onLogin={() => {}} />);
    expect(screen.getByText(/CarbonSense/i)).toBeInTheDocument();
  });

  it('renders the Google login button', () => {
    render(<AuthScreen onLogin={() => {}} />);
    const loginButton = screen.getByRole('button', { name: /continue with google/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('handles button clicks without crashing', () => {
    render(<AuthScreen onLogin={() => {}} />);
    const loginButton = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(loginButton);
    // As long as it doesn't throw an error, the edge case is covered
    expect(loginButton).toBeInTheDocument(); 
  });
});
