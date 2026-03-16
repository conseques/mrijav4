import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   UKRAINIAN SUNFLOWER - Central 3D element
   Petals in Fibonacci spiral, golden glow
   Replaces the "planets" from the inspiration
═══════════════════════════════════════════════════════ */
function Sunflower({ position = [0, 0, -8], scale = 1.8 }) {
  const flowerRef = useRef();
  
  // Generate petals in Fibonacci spiral
  const petals = useMemo(() => {
    const result = [];
    const numPetals = 24;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    
    for (let i = 0; i < numPetals; i++) {
      const angle = i * goldenAngle;
      const radius = 1.2 + (i / numPetals) * 0.6;
      const petalLength = 0.5 + Math.random() * 0.3;
      const petalWidth = 0.12 + Math.random() * 0.08;
      result.push({
        position: [
          Math.cos(angle) * radius * 0.3,
          Math.sin(angle) * radius * 0.3,
          0.05
        ],
        rotation: [0, 0, angle],
        scale: [petalWidth, petalLength, 0.02],
        color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FFC107' : '#FFB300'
      });
    }
    return result;
  }, []);

  // Fibonacci seeds for center
  const seeds = useMemo(() => {
    const result = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < 80; i++) {
      const r = Math.sqrt(i / 80) * 0.45;
      const theta = i * goldenAngle;
      result.push({
        position: [Math.cos(theta) * r, Math.sin(theta) * r, 0.15],
        size: 0.02 + (i / 80) * 0.015,
        color: i % 4 === 0 ? '#8B4513' : '#654321'
      });
    }
    return result;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (flowerRef.current) {
      flowerRef.current.rotation.z = t * 0.15;
      flowerRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
      flowerRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <group ref={flowerRef} position={position} scale={scale}>
      {/* Center disc */}
      <mesh position={[0, 0, 0.1]}>
        <circleGeometry args={[0.5, 64]} />
        <meshStandardMaterial color="#2a1200" roughness={0.95} />
      </mesh>
      
      {/* Seeds */}
      {seeds.map((seed, i) => (
        <mesh key={`seed-${i}`} position={seed.position}>
          <circleGeometry args={[seed.size, 6]} />
          <meshStandardMaterial color={seed.color} roughness={0.85} />
        </mesh>
      ))}
      
      {/* Outer petals */}
      {petals.map((petal, i) => (
        <mesh key={`petal-${i}`} position={petal.position} rotation={petal.rotation} scale={petal.scale}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color={petal.color} 
            side={THREE.DoubleSide} 
            roughness={0.5} 
            metalness={0.15}
            emissive={petal.color}
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}
      
      {/* Inner petals (smaller, offset) */}
      {petals.slice(0, 16).map((petal, i) => (
        <mesh 
          key={`inner-${i}`} 
          position={[petal.position[0] * 0.7, petal.position[1] * 0.7, 0.08]}
          rotation={[0, 0, petal.rotation[2] + 0.2]}
          scale={[petal.scale[0] * 0.7, petal.scale[1] * 0.7, petal.scale[2]]}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color="#E6A800" 
            side={THREE.DoubleSide} 
            roughness={0.6} 
            metalness={0.1}
          />
        </mesh>
      ))}
      
      {/* Glow ring */}
      <mesh position={[0, 0, -0.05]}>
        <ringGeometry args={[1.0, 2.5, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   DREAM PARTICLES - Rising golden motes
   Symbolize hope and dreams rising upward
═══════════════════════════════════════════════════════ */
function DreamParticles() {
  const particlesRef = useRef();
  const count = 1200;
  
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const blue = new THREE.Color('#4a90d9');
    const gold = new THREE.Color('#FFD700');
    const white = new THREE.Color('#ffffff');
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
      
      // Mix of blue (sky) and gold (wheat) particles
      const colorChoice = Math.random();
      const c = colorChoice < 0.4 ? blue : colorChoice < 0.8 ? gold : white;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      
      sz[i] = 0.05 + Math.random() * 0.15;
    }
    
    return { positions: pos, colors: col, sizes: sz };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // Gentle rising motion
        positions[i * 3 + 1] += 0.003 + Math.sin(t + i) * 0.002;
        if (positions[i * 3 + 1] > 35) {
          positions[i * 3 + 1] = -35;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = t * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════
   TRIDENT SYMBOL - Small, floating in background
   Subtle Ukrainian Tryzub
═══════════════════════════════════════════════════════ */
function TridentSymbol() {
  const ref = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.3) * 0.2;
      ref.current.position.y = Math.sin(t * 0.4) * 0.5;
    }
  });

  return (
    <group ref={ref} position={[15, 3, -25]} scale={2}>
      {/* Central stem */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Left prong */}
      <mesh position={[-0.5, 1.2, 0]}>
        <boxGeometry args={[0.12, 1.5, 0.12]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Right prong */}
      <mesh position={[0.5, 1.2, 0]}>
        <boxGeometry args={[0.12, 1.5, 0.12]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Center prong (taller) */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.3, 0.1, 0.12]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   WHEAT FIELD - Bottom of hero
   Golden wheat stalks swaying gently
═══════════════════════════════════════════════════════ */
function WheatField() {
  const ref = useRef();
  const stalkCount = 200;
  
  const stalks = useMemo(() => {
    const result = [];
    for (let i = 0; i < stalkCount; i++) {
      result.push({
        position: [
          (Math.random() - 0.5) * 60,
          -18 - Math.random() * 8,
          -15 - Math.random() * 20
        ],
        height: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
      });
    }
    return result;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.children.forEach((stalk, i) => {
        if (stalks[i]) {
          stalk.rotation.z = Math.sin(t * 0.8 + stalks[i].phase) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={ref}>
      {stalks.map((stalk, i) => (
        <mesh key={i} position={stalk.position}>
          <cylinderGeometry args={[0.02, 0.03, stalk.height, 4]} />
          <meshStandardMaterial 
            color="#DAA520" 
            roughness={0.7}
            emissive="#FFD700"
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN HERO SCENE
═══════════════════════════════════════════════════════ */
const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60 }}
      style={{ 
        position: 'absolute', 
        inset: 0, 
        width: '100%', 
        height: '100%',
        background: 'transparent'
      }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 15, 10]} intensity={1.5} color="#FFD700" />
      <pointLight position={[-10, 5, 5]} intensity={0.8} color="#4a90d9" />
      <pointLight position={[0, -5, 10]} intensity={0.5} color="#FFD700" />
      
      {/* 3D Elements */}
      <Sunflower position={[0, 0, -5]} scale={2.5} />
      <DreamParticles />
      <TridentSymbol />
      <WheatField />
    </Canvas>
  );
};

export default HeroScene;
