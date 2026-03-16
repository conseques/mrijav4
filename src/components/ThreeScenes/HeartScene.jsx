import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* HEART SCENE - Humanitarian Aid Program */
function HeartParticles() {
  const ref = useRef();
  const count = 500;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const blue = new THREE.Color('#4a90d9');
    const gold = new THREE.Color('#FFD700');
    
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3) / 18;
      const hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 18;
      
      pos[i * 3] = hx + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 1] = hy + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      
      const c = i % 2 === 0 ? gold : blue;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const pulse = 1 + Math.sin(t * 2.2) * 0.08;
      ref.current.scale.setScalar(pulse);
      ref.current.rotation.y = Math.sin(t * 0.4) * 0.3;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

const HeartScene = () => (
  <Canvas camera={{ position: [0, 0, 3.5], fov: 52 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
    <ambientLight intensity={0.3} />
    <pointLight position={[2, 2, 3]} intensity={1} color="#FFD700" />
    <HeartParticles />
  </Canvas>
);

export default HeartScene;
