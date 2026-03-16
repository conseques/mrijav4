import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

/* CUBE WAVE SCENE - Reconstruction Program */
function CubeWaveGrid() {
  const groupRef = useRef();
  const cubeCount = 5;
  const spacing = 0.4;
  
  const cubeData = useMemo(() => {
    const data = [];
    for (let x = 0; x < cubeCount; x++) {
      for (let z = 0; z < cubeCount; z++) {
        const h = 0.4 + Math.random() * 1;
        const color = (x + z) % 2 === 0 ? '#005BBB' : '#FFD700';
        data.push({
          pos: [(x - cubeCount / 2 + 0.5) * spacing, 0, (z - cubeCount / 2 + 0.5) * spacing],
          baseHeight: h,
          color
        });
      }
    }
    return data;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((cube, i) => {
        if (cubeData[i]) {
          const wave = Math.sin(t * 1.8 + cubeData[i].pos[0] * 4 + cubeData[i].pos[2] * 3) * 0.3;
          cube.scale.y = 1 + wave * 0.5;
          cube.position.y = wave * 0.15;
        }
      });
      groupRef.current.rotation.y = t * 0.2;
      groupRef.current.rotation.x = 0.3;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {cubeData.map((cube, i) => (
        <mesh key={i} position={cube.pos}>
          <boxGeometry args={[0.28, cube.baseHeight, 0.28]} />
          <meshStandardMaterial color={cube.color} metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

const CubeWaveScene = () => (
  <Canvas camera={{ position: [2.5, 2.5, 5], fov: 48 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
    <ambientLight intensity={0.3} />
    <pointLight position={[4, 6, 4]} intensity={2} color="#FFD700" />
    <pointLight position={[-4, 2, 4]} intensity={1.5} color="#005BBB" />
    <CubeWaveGrid />
  </Canvas>
);

export default CubeWaveScene;
