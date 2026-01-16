import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Workaround for missing R3F types in JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointLight: any;
      instancedMesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      spotLight: any;
      fog: any;
    }
  }
}

// Augment 'react' module's JSX namespace for React 18+ support
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      pointLight: any;
      instancedMesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      spotLight: any;
      fog: any;
    }
  }
}

const OrganicWave = () => {
  const count = 2000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Initialize particles in a grid/cloud formation
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.getElapsedTime();

    // Move the light slightly to create dynamic shadows
    if(lightRef.current) {
        lightRef.current.position.x = Math.sin(time * 0.5) * 20;
        lightRef.current.position.z = Math.cos(time * 0.3) * 20;
    }

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      // Organic Wave Equation
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      // Make them face "up" roughly but rotate gently
      dummy.scale.setScalar(0.15 + Math.abs(s) * 0.1); // Breathing size
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={lightRef} distance={60} intensity={2} color="#06b6d4" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.2, 8, 8]} /> {/* Softer shape than box */}
        <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#1d4ed8"
            emissiveIntensity={0.5}
            roughness={0.4}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </>
  );
};

const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#020205]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />
        
        {/* Soft, professional lighting setup */}
        <ambientLight intensity={0.4} color="#a5b4fc" /> {/* Subtle purple tint for human touch */}
        <spotLight position={[50, 50, 50]} angle={0.2} penumbra={1} intensity={1} color="#60a5fa" />
        
        <fog attach="fog" args={['#020205', 20, 90]} />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        {/* Replaced rigid grid with organic particle flow */}
        <OrganicWave />
      </Canvas>
      
      {/* Vignette Overlay for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#020205_100%)] pointer-events-none" />
    </div>
  );
};

export default Background3D;