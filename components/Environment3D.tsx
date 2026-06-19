import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

export interface Environment3DProps {
  environmentStateVector: number;
  lightingHex: string;
  particleDensity: number;
}

const ReactiveSwarm: React.FC<{ count?: number; color: string }> = ({ count = 4000, color }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, camera } = useThree();
  
  // Generate initial particle grid/sphere
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Golden ratio spiral on a sphere
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      const r = 3 + Math.random() * 5; 
      
      const baseX = r * Math.sin(phi) * Math.cos(theta);
      const baseY = r * Math.sin(phi) * Math.sin(theta);
      const baseZ = r * Math.cos(phi);
      
      temp.push({
        baseX, baseY, baseZ,
        x: baseX, y: baseY, z: baseZ,
        speed: 0.02 + Math.random() * 0.05, // Significantly reduced speed
        angleOffset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const mousePos = camera.position.clone().add(dir.multiplyScalar(distance));

    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      const currentAngle = time * p.speed + p.angleOffset;
      const swirlX = p.baseX * Math.cos(currentAngle) - p.baseZ * Math.sin(currentAngle);
      const swirlZ = p.baseZ * Math.cos(currentAngle) + p.baseX * Math.sin(currentAngle);
      const swirlY = p.baseY + Math.sin(time * 0.2 + p.baseX) * 0.3; // Reduced bobbing speed
      
      const dx = mousePos.x - swirlX;
      const dy = mousePos.y - swirlY;
      const dz = mousePos.z - swirlZ;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      let pushX = 0, pushY = 0, pushZ = 0;
      if (dist < 4) {
        const force = Math.pow((4 - dist) / 4, 2) * 3;
        pushX = -(dx / dist) * force;
        pushY = -(dy / dist) * force;
        pushZ = -(dz / dist) * force;
      }
      
      p.x = THREE.MathUtils.lerp(p.x, swirlX + pushX, 0.1);
      p.y = THREE.MathUtils.lerp(p.y, swirlY + pushY, 0.1);
      p.z = THREE.MathUtils.lerp(p.z, swirlZ + pushZ, 0.1);

      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.015; // Reduced global rotation
    pointsRef.current.rotation.x = time * 0.005; // Reduced global rotation
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        color={color} 
        transparent 
        opacity={0.8} 
        sizeAttenuation 
      />
    </points>
  );
};

const Scene: React.FC<Environment3DProps> = ({ environmentStateVector, lightingHex, particleDensity }) => {
  return (
    <>
      <color attach="background" args={['#f8fafc']} /> {/* Very light slate for premium light theme contrast */}
      
      <ambientLight intensity={0.6} />
      <Environment preset="studio" />

      {/* Convert the density (usually 10-100) to a larger swarm count. Cap at 5000 for performance */}
      <ReactiveSwarm count={Math.min(particleDensity * 50, 4000)} color={lightingHex} />
    </>
  );
};

export const Environment3D: React.FC<Environment3DProps> = (props) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const healthPercent = Math.round(props.environmentStateVector * 100);

  return (
    <div 
      className="absolute inset-0 w-full h-full z-0"
      style={{ pointerEvents: 'auto' }} // Enable pointer events to allow mouse tracking
      role="img" 
      aria-label={`3D Environmental Background. Current ecosystem state is ${healthPercent}% healthy.`}
    >
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]} // Crisp rendering
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }} 
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
};

export default Environment3D;
