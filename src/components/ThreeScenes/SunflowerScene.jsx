import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   GROWING SUNFLOWER - For About Section
   Spins slowly, petals radiate outward
═══════════════════════════════════════════════════════ */
function GrowingSunflower() {
  const flowerRef = useRef();
  
  const petalData = useMemo(() => {
    const petals = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    
    // Outer ring of petals
    for (let i = 0; i < 20; i++) {
      const angle = i * goldenAngle;
      petals.push({
        pos: [Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0],
        rot: [0, 0, angle],
        scale: [0.12, 0.45, 0.01],
        color: i % 2 === 0 ? '#FFD700' : '#FFC107'
      });
    }
    
    // Inner ring
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + 0.15;
      petals.push({
        pos: [Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0.02],
        rot: [0, 0, angle],
        scale: [0.08, 0.3, 0.01],
        color: '#E6A800'
      });
    }
    
    return petals;
  }, []);

  const seedData = useMemo(() => {
    const seeds = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < 60; i++) {
      const r = Math.sqrt(i / 60) * 0.35;
      const theta = i * goldenAngle;
      seeds.push({
        pos: [Math.cos(theta) * r, Math.sin(theta) * r, 0.05],
        size: 0.015 + (i / 60) * 0.012,
        color: i % 3 === 0 ? '#8B4513' : '#654321'
      });
    }
    return seeds;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (flowerRef.current) {
      flowerRef.current.rotation.z = t * 0.2;
      flowerRef.current.rotation.x = Math.sin(t * 0.3) * 0.12;
      flowerRef.current.rotation.y = Math.sin(t * 0.4) * 0.1;
    }
  });

  return (
    <group ref={flowerRef}>
      {/* Center disc */}
      <mesh position={[0, 0, 0.04]}>
        <circleGeometry args={[0.4, 64]} />
        <meshStandardMaterial color="#2a1200" roughness={0.95} />
      </mesh>
      
      {/* Seeds */}
      {seedData.map((seed, i) => (
        <mesh key={`s-${i}`} position={seed.pos}>
          <circleGeometry args={[seed.size, 6]} />
          <meshStandardMaterial color={seed.color} roughness={0.9} />
        </mesh>
      ))}
      
      {/* Petals */}
      {petalData.map((petal, i) => (
        <mesh key={`p-${i}`} position={petal.pos} rotation={petal.rot} scale={petal.scale}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color={petal.color} 
            side={THREE.DoubleSide}
            roughness={0.5}
            metalness={0.15}
            emissive={petal.color}
            emissiveIntensity={0.06}
          />
        </mesh>
      ))}
      
      {/* Stem */}
      <mesh position={[0, -1.8, -0.05]}>
        <cylinderGeometry args={[0.04, 0.06, 3, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
      
      {/* Leaves on stem */}
      <mesh position={[-0.3, -1.2, 0.05]} rotation={[0, 0, -0.5]}>
        <planeGeometry args={[0.4, 0.15]} />
        <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      <mesh position={[0.25, -1.6, 0.05]} rotation={[0, 0, 0.4]}>
        <planeGeometry args={[0.35, 0.12]} />
        <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
    </group>
  );
}

const SunflowerScene = ({ className }) => {
  return (
    <div className={className} style={{ width: '280px', height: '280px', borderRadius: '50%', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 42 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 4, 4]} intensity={2.5} color="#FFD700" />
        <pointLight position={[-2, -1, 3]} intensity={1} color="#4a90d9" />
        <pointLight position={[0, 0, 2]} intensity={0.5} color="#FFD700" />
        <GrowingSunflower />
      </Canvas>
    </div>
  );
};

export default SunflowerScene;
