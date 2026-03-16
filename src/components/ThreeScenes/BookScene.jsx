import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

/* BOOK SCENE - Education Program */
function OpenBook() {
  const groupRef = useRef();
  const leftCoverRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.35;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1 - 0.15;
    }
    if (leftCoverRef.current) {
      leftCoverRef.current.rotation.y = -Math.abs(Math.sin(t * 0.4)) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Spine */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 1.1, 0.9]} />
        <meshStandardMaterial color="#3a1800" metalness={0.2} roughness={0.7} />
      </mesh>
      
      {/* Left cover */}
      <mesh ref={leftCoverRef} position={[-0.42, 0, 0.04]}>
        <boxGeometry args={[0.7, 1.1, 0.05]} />
        <meshStandardMaterial color="#005BBB" metalness={0.3} roughness={0.5} />
      </mesh>
      
      {/* Right cover */}
      <mesh position={[0.42, 0, 0.04]}>
        <boxGeometry args={[0.7, 1.1, 0.05]} />
        <meshStandardMaterial color="#005BBB" metalness={0.3} roughness={0.5} />
      </mesh>
      
      {/* Pages */}
      {[...Array(5)].map((_, p) => (
        <mesh key={p} position={[-0.4 + p * 0.01, 0, 0.02 + p * 0.015]}>
          <boxGeometry args={[0.65, 1, 0.006]} />
          <meshStandardMaterial color="#f5f0e5" roughness={0.95} />
        </mesh>
      ))}
      
      {/* Gold stars on left cover */}
      {[[-0.15, 0.25], [-0.35, 0.05], [-0.1, -0.15], [-0.45, 0.35], [-0.55, -0.05]].map(([sx, sy], i) => (
        <mesh key={`star-${i}`} position={[sx, sy, 0.08]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

const BookScene = () => (
  <Canvas camera={{ position: [0, 1, 3.5], fov: 50 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
    <ambientLight intensity={0.35} />
    <pointLight position={[2, 4, 3]} intensity={2} color="#FFD700" />
    <pointLight position={[-2, 1, 3]} intensity={1.2} color="#4a90d9" />
    <OpenBook />
  </Canvas>
);

export default BookScene;
