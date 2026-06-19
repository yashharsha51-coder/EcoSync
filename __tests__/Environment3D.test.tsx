import { render } from '@testing-library/react';
import { Environment3D } from '../components/Environment3D';

// Mocking react-three-fiber because WebGL isn't supported in standard JSDOM
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="r3f-canvas">{children}</div>,
  useFrame: jest.fn(),
}));

describe('Environment3D Component', () => {
  it('renders without crashing and includes accessibility labels', () => {
    const { getByRole, getByTestId } = render(
      <Environment3D 
        environmentStateVector={0.8} 
        lightingHex="#A3E4D7" 
        particleDensity={250} 
      />
    );

    // Verify accessibility wrapper
    const container = getByRole('img');
    expect(container).toBeInTheDocument();
    
    // 0.8 * 100 = 80
    expect(container).toHaveAttribute('aria-label', expect.stringContaining('80% healthy'));
    
    // Verify canvas mocked render
    expect(getByTestId('r3f-canvas')).toBeInTheDocument();
  });
});
