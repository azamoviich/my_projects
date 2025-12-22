import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fix for TypeScript errors: 'Property ... does not exist on type JSX.IntrinsicElements'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointLight: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      fog: any;
      mesh: any;
      icosahedronGeometry: any;
      meshStandardMaterial: any;
      group: any;
      ambientLight: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      pointLight: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      fog: any;
      mesh: any;
      icosahedronGeometry: any;
      meshStandardMaterial: any;
      group: any;
      ambientLight: any;
    }
  }
}

const FloatingShapes = () => {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
        group.current.rotation.x = t * 0.1;
        group.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group ref={group}>
        <mesh position={[4, 2, -5]}>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#00f0ff" wireframe opacity={0.1} transparent />
        </mesh>
        <mesh position={[-4, -2, -10]}>
            <icosahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#ffffff" wireframe opacity={0.05} transparent />
        </mesh>
        <mesh position={[0, 5, -8]}>
            <icosahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#00f0ff" wireframe opacity={0.1} transparent />
        </mesh>
    </group>
  );
};

const ParticleSystem = ({ count = 3000 }) => {
  const mesh = useRef<THREE.Points>(null!);
  const light = useRef<THREE.PointLight>(null!);
  
  // Create particles
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = state.mouse.x * 2;
    const mouseY = state.mouse.y * 2;

    if (mesh.current) {
      // Gentle rotation
      mesh.current.rotation.x = time * 0.05 + mouseY * 0.1;
      mesh.current.rotation.y = time * 0.03 + mouseX * 0.1;

      // Pulse effect scale
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      mesh.current.scale.set(scale, scale, scale);
    }
    
    if (light.current) {
        // Light follows mouse loosely for depth effect
        light.current.position.x = mouseX * 5;
        light.current.position.y = mouseY * 5;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={2} color="#00f0ff" />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          color="#ffffff"
          sizeAttenuation
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

const StarField: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={['#050505', 3, 10]} />
        <ambientLight intensity={0.5} />
        <FloatingShapes />
        <ParticleSystem />
      </Canvas>
    </div>
  );
};

export default StarField;