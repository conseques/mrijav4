import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   HEART SCENE - Humanitarian Aid Program
   Pulsing particle heart in blue and gold
═══════════════════════════════════════════════════════ */
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
      // Parametric heart
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

export const HeartScene = () => (
  <Canvas camera={{ position: [0, 0, 3.5], fov: 52 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
    <ambientLight intensity={0.3} />
    <pointLight position={[2, 2, 3]} intensity={1} color="#FFD700" />
    <HeartParticles />
  </Canvas>
);

/* ═══════════════════════════════════════════════════════
   CUBE WAVE SCENE - Reconstruction Program
   Grid of cubes in wave pattern (building back)
═══════════════════════════════════════════════════════ */
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

export const CubeWaveScene = () => (
  <Canvas camera={{ position: [2.5, 2.5, 5], fov: 48 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
    <ambientLight intensity={0.3} />
    <pointLight position={[4, 6, 4]} intensity={2} color="#FFD700" />
    <pointLight position={[-4, 2, 4]} intensity={1.5} color="#005BBB" />
    <CubeWaveGrid />
  </Canvas>
);

/* ═══════════════════════════════════════════════════════
   BOOK SCENE - Education Program
   Open book with stars on cover, pages flutter
═══════════════════════════════════════════════════════ */
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

export const BookScene = () => (
  <Canvas camera={{ position: [0, 1, 3.5], fov: 50 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
    <ambientLight intensity={0.35} />
    <pointLight position={[2, 4, 3]} intensity={2} color="#FFD700" />
    <pointLight position={[-2, 1, 3]} intensity={1.2} color="#4a90d9" />
    <OpenBook />
  </Canvas>
);

/* ═══════════════════════════════════════════════════════
   CRYSTAL SCENE - Cultural Heritage Program
   Crystal sphere with golden rings (pysanka-inspired)
═══════════════════════════════════════════════════════ */
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

export const CrystalScene = () => (
  <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
    <ambientLight intensity={0.3} />
    <pointLight position={[2, 4, 3]} intensity={2.5} color="#FFD700" />
    <pointLight position={[-3, -2, 2]} intensity={1.5} color="#005BBB" />
    <CrystalSphere />
  </Canvas>
);
