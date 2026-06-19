import { render, screen, waitFor } from '@testing-library/react';
import { LeaderboardView } from '../views/LeaderboardView';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    docs: [
      { id: '1', data: () => ({ name: 'Yashwanth', score: 950, footprint: 4.2 }) },
      { id: '2', data: () => ({ name: 'Alex', score: 820, footprint: 6.8 }) }
    ]
  }))
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null); // Not logged in
    return jest.fn(); // unsub function
  })
}));

jest.mock('../lib/firebase', () => ({
  db: {},
  auth: {}
}));

describe('LeaderboardView Component', () => {
  it('renders the leaderboard heading', () => {
    render(<LeaderboardView />);
    expect(screen.getByText(/global leaderboard/i)).toBeInTheDocument();
  });

  it('fetches and displays user rankings correctly', async () => {
    render(<LeaderboardView />);
    
    // Wait for the mocked Firebase data to resolve and render
    await waitFor(() => {
      expect(screen.getByText('Yashwanth')).toBeInTheDocument();
      expect(screen.getByText('950')).toBeInTheDocument();
      expect(screen.getByText('Alex')).toBeInTheDocument();
      expect(screen.getByText('820')).toBeInTheDocument();
    });
  });
});
