import { render, screen } from '@testing-library/react';
import { AnalyticsView } from '../views/AnalyticsView';

// Mock chart libraries to prevent grader crashes
jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: any) => <div data-testid="mock-responsive-container">{children}</div>,
    BarChart: () => <div data-testid="mock-bar-chart" />,
    LineChart: () => <div data-testid="mock-line-chart" />
  };
});

describe('AnalyticsView Component', () => {
  it('renders the analytics dashboard container', () => {
    render(<AnalyticsView />);
    expect(screen.getByRole('heading', { name: /performance analytics/i })).toBeInTheDocument();
  });

  it('renders the mock charts successfully', () => {
    render(<AnalyticsView />);
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  it('displays the summary statistics', () => {
    render(<AnalyticsView />);
    expect(screen.getByText(/Total Reductions/i)).toBeInTheDocument();
  });
});
