import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh } from 'three';

interface MarketNode {
  id: string;
  symbol: string;
  position: [number, number, number];
  price: number;
  change: number;
  size: number;
}

const marketData: MarketNode[] = [
  { id: '1', symbol: 'BTC', position: [2, 0.5, 0], price: 45234, change: 2.45, size: 0.3 },
  { id: '2', symbol: 'ETH', position: [0, 2, 0.5], price: 3234, change: -1.23, size: 0.25 },
  { id: '3', symbol: 'AAPL', position: [-1.5, 0.5, 1.5], price: 178, change: 0.87, size: 0.2 },
  { id: '4', symbol: 'TSLA', position: [1, -1.5, 0.8], price: 234, change: 3.21, size: 0.18 },
  { id: '5', symbol: 'NVDA', position: [-0.8, 1.2, -1.8], price: 456, change: -0.94, size: 0.22 },
  { id: '6', symbol: 'GOOGL', position: [1.8, -0.8, -1], price: 138, change: 1.56, size: 0.2 },
];

function MarketNode({ node }: { node: MarketNode }) {
  const meshRef = useRef<Mesh>(null);
  const isPositive = node.change >= 0;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = node.size + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={node.position}>
      <Sphere
        ref={meshRef}
        args={[node.size, 16, 16]}
      >
        <meshStandardMaterial
          color={isPositive ? '#10b981' : '#ef4444'}
          emissive={isPositive ? '#065f46' : '#7f1d1d'}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Price Label */}
      <Html
        position={[0, node.size + 0.3, 0]}
        center
        style={{
          fontSize: '12px',
          color: 'white',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0,0,0,0.8)',
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.6)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: `1px solid ${isPositive ? '#10b981' : '#ef4444'}`
        }}
      >
        <div className="text-center">
          <div className="font-bold">{node.symbol}</div>
          <div className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{node.change.toFixed(2)}%
          </div>
        </div>
      </Html>

      {/* Glow effect */}
      <Sphere args={[node.size * 1.5, 16, 16]}>
        <meshBasicMaterial
          color={isPositive ? '#10b981' : '#ef4444'}
          transparent
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
}

function CentralGlobe() {
  const globeRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Sphere ref={globeRef} args={[1, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#1e293b"
        transparent
        opacity={0.2}
        wireframe
      />
    </Sphere>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <sphereGeometry args={[3, 100, 100]} />
      <pointsMaterial
        size={0.02}
        color="#3b82f6"
        transparent
        opacity={0.4}
      />
    </points>
  );
}

export function MarketGlobe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Globe */}
      <CentralGlobe />

      {/* Market Nodes */}
      {marketData.map((node) => (
        <MarketNode key={node.id} node={node} />
      ))}

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Title Text */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        GLOBAL MARKETS
      </Text>

      {/* Lighting */}
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#10b981" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
      />
    </group>
  );
}
