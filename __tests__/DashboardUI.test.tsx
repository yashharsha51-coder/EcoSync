import { render, screen } from '@testing-library/react';
import { DashboardUI } from '../components/DashboardUI';

describe('DashboardUI Component', () => {
  const mockData = {
    telemetry_processed: true,
    metrics: {
      daily_co2e_kg: 12.5,
      weekly_trajectory: 'improving',
    },
    user_delivery: {
      acknowledgment: 'Great job today. You saved 1.2kg of CO2e.',
      micro_frictionless_action: 'Walk to the store instead of driving.',
    },
  };

  it('displays loading state correctly and respects accessibility', () => {
    render(<DashboardUI data={null} isLoading={true} />);
    
    const loadingElement = screen.getByText(/SYNCING TELEMETRY/i);
    expect(loadingElement).toBeInTheDocument();
    
    // Check accessibility tags for the loading region
    const liveRegion = loadingElement.closest('[aria-live="polite"]');
    expect(liveRegion).toHaveAttribute('aria-busy', 'true');
  });

  it('renders telemetry data using glassmorphism design rules', () => {
    render(<DashboardUI data={mockData} isLoading={false} />);
    
    // Verify content mapping
    expect(screen.getByText('Great job today. You saved 1.2kg of CO2e.')).toBeInTheDocument();
    expect(screen.getByText('12.5')).toBeInTheDocument();
    expect(screen.getByText('improving')).toBeInTheDocument();
    expect(screen.getByText('Walk to the store instead of driving.')).toBeInTheDocument();

    // Check action button accessibility
    const commitButton = screen.getByRole('button', { name: /Commit to suggested frictionless action/i });
    expect(commitButton).toBeInTheDocument();
  });
});
