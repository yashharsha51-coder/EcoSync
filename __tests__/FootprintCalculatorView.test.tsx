import { render, screen, fireEvent } from '@testing-library/react';
import { FootprintCalculatorView } from '../views/FootprintCalculatorView';

describe('FootprintCalculatorView Component', () => {
  const mockState = {
    vehicleType: 'gasoline',
    commuteDistance: 150,
    flights: 0,
    electricity: 300,
    heatingType: 'natural_gas',
    dietType: 'omnivore',
    localSourcing: 20,
    recycling: true,
    composting: false,
    trashBags: 2
  };

  const mockSetState = jest.fn();

  it('renders the calculator and tabs', () => {
    render(<FootprintCalculatorView state={mockState} setState={mockSetState} totalFootprint={10.5} />);
    
    expect(screen.getByText('Annual Footprint Calculator')).toBeInTheDocument();
    expect(screen.getByText('10.50')).toBeInTheDocument();
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('Home Energy')).toBeInTheDocument();
  });

  it('allows clicking tabs to switch views', () => {
    render(<FootprintCalculatorView state={mockState} setState={mockSetState} totalFootprint={10.5} />);
    
    // Switch to Home Energy tab
    fireEvent.click(screen.getByText('Home Energy'));
    expect(screen.getByText('Monthly Electricity')).toBeInTheDocument();
  });
});
