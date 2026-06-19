import { render, screen } from '@testing-library/react';
import { DashboardUI } from '../components/DashboardUI';

describe('DashboardUI Component', () => {
  const mockData = {
    carbon_footprint: {
      total_estimated_kg_co2_per_day: 12.5,
      breakdown: [
        { category: "Transport", amount: 5, severity: "High" }
      ]
    },
    sustainability_score: 85,
    ai_recommendations: [
      "Use public transit."
    ],
    environment_state_vector: 0.85,
    suggested_lighting_hex: "#14b8a6"
  };

  it('displays loading state correctly', () => {
    // @ts-ignore
    render(<DashboardUI data={null} isLoading={true} />);
    const loadingElement = screen.getByText(/Syncing Ecosystem Data.../i);
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders telemetry data correctly', () => {
    render(<DashboardUI data={mockData} isLoading={false} />);
    
    // Check score
    expect(screen.getByText('85')).toBeInTheDocument();
    
    // Check footprint
    expect(screen.getByText('12.5')).toBeInTheDocument();
    
    // Check breakdown category
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });
});
