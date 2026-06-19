import { render, screen, fireEvent } from '@testing-library/react';
import { DailyTrackerView } from '../views/DailyTrackerView';

describe('DailyTrackerView Component', () => {
  it('renders the checklist and initial state correctly', () => {
    render(<DailyTrackerView />);
    
    expect(screen.getByText('Sustainability Tracker')).toBeInTheDocument();
    expect(screen.getByText('0/5')).toBeInTheDocument();
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('updates completed actions and CO2 saved when items are clicked', () => {
    render(<DailyTrackerView />);
    
    // First action: "Used public transit or carpooled" - saves 2.4
    const firstAction = screen.getByText('Used public transit or carpooled');
    fireEvent.click(firstAction);
    
    expect(screen.getByText('1/5')).toBeInTheDocument();
    expect(screen.getByText('2.4')).toBeInTheDocument();

    // Second action: "Brought a reusable coffee cup" - saves 0.2
    const secondAction = screen.getByText('Brought a reusable coffee cup');
    fireEvent.click(secondAction);
    
    expect(screen.getByText('2/5')).toBeInTheDocument();
    expect(screen.getByText('2.6')).toBeInTheDocument();
  });
});
