import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* CRYSTAL SCENE - Cultural Heritage Program */
function CrystalSphere() {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
  });

  const rings = useMemo(() => [
    { rot: [0, 0, 0], color: '#FFD700' },
    { rot: [Math.PI / 4, 0, 0], color: '#005BBB' },
    { rot: [Math.PI / 2, 0, 0], color: '#FFD700' },
    { rot: [-Math.PI / 4, 0, 0], color: '#005BBB' },
    { rot: [Math.PI / 6, Math.PI / 3, 0], color: '#FFD700' },
  ], []);

  const orbitDots = useMemo(() => {
    return [...Array(8)].map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return {
        pos: [Math.cos(a) * 1.05, Math.sin(a) * 0.3, Math.sin(a) * 0.9],
        color: i % 2 === 0 ? '#FFD700' : '#4a90d9'
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.7, 40, 40]} />
        <meshStandardMaterial color="#07152e" metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Wireframe shell */}
      <mesh>
        <sphereGeometry args={[0.76, 16, 16]} />
        <meshBasicMaterial color="#005BBB" wireframe transparent opacity={0.2} />
      </mesh>
      
      {/* Rings */}
      {rings.map((ring, i) => (
        <mesh key={i} rotation={ring.rot}>
          <torusGeometry args={[0.85 + i * 0.05, 0.018, 8, 64]} />
          <meshStandardMaterial 
            color={ring.color} 
            metalness={0.65} 
            roughness={0.3}
            emissive={ring.color}
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}
      
      {/* Orbiting dots */}
      {orbitDots.map((dot, i) => (
        <mesh key={`dot-${i}`} position={dot.pos}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={dot.color} emissive="#ffffff" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

const CrystalScene = () => (
  <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
    <ambientLight intensity={0.3} />
    <pointLight position={[2, 4, 3]} intensity={2.5} color="#FFD700" />
    <pointLight position={[-3, -2, 2]} intensity={1.5} color="#005BBB" />
    <CrystalSphere />
  </Canvas>
);

export default CrystalScene;
