'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';
import { SRI_YANTRA_LAYERS } from './sri-yantra-geometry';

export interface YantraPalette {
  ink: string;
  accent: string;
  soft: string;
}

interface Props {
  /** Normalised cursor position over the hero, each in [-0.5, 0.5]. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** Page scroll velocity in px/s; spins the figure a little faster while scrolling. */
  scrollVelocity: MotionValue<number>;
  palette: YantraPalette;
  /** False while the hero is off screen: the render loop stops. */
  active: boolean;
}

function Yantra({ pointerX, pointerY, scrollVelocity, palette }: Omit<Props, 'active'>) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const spin = useRef(0);

  const layers = useMemo(
    () =>
      SRI_YANTRA_LAYERS.map((layer) => ({
        ...layer,
        color: layer.kind === 'shiva' ? palette.ink : layer.kind === 'shakti' ? palette.accent : palette.soft,
        width: layer.kind === 'shiva' || layer.kind === 'shakti' ? 1.6 : 1,
        opacity: layer.kind === 'shiva' || layer.kind === 'shakti' ? 0.95 : 0.55,
        points: layer.paths.map((p) => p.map(([x, y]) => new THREE.Vector3(x, y, layer.depth))),
      })),
    [palette],
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    // Rotation velocity: a slow constant turn plus a share of the scroll speed.
    const boost = Math.min(Math.abs(scrollVelocity.get()) / 2500, 1.2);
    spin.current += delta * (0.06 + boost * 0.5);
    g.rotation.z = spin.current;
    // The figure leans toward the cursor; damped so it moves like liquid, not a pointer.
    const px = pointerX.get();
    const py = pointerY.get();
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.55 + py * 0.5, 3, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.6, 3, delta);
    if (light.current) {
      light.current.position.x = THREE.MathUtils.damp(light.current.position.x, px * 6, 4, delta);
      light.current.position.y = THREE.MathUtils.damp(light.current.position.y, -py * 6, 4, delta);
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={light} position={[0, 0, 3.5]} intensity={28} distance={12} color={palette.accent} />
      <group ref={group} scale={0.92}>
        {layers.map((layer) =>
          layer.points.map((pts, i) => (
            <Line
              key={`${layer.id}-${i}`}
              points={pts}
              color={layer.color}
              lineWidth={layer.width}
              transparent
              opacity={layer.opacity}
            />
          )),
        )}
        {/* Bindu: a glass drop at the centre that catches the cursor's light. */}
        <mesh position={[0, 0, 0.5]}>
          <sphereGeometry args={[0.075, 48, 48]} />
          <meshPhysicalMaterial
            color={palette.accent}
            roughness={0.08}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transmission={0.6}
            thickness={0.4}
            ior={1.45}
          />
        </mesh>
        {/* A glass ring at the lotus, lit by the same light. */}
        <mesh position={[0, 0, -0.08]}>
          <torusGeometry args={[1.02, 0.012, 16, 160]} />
          <meshPhysicalMaterial color={palette.soft} roughness={0.15} clearcoat={1} transmission={0.5} thickness={0.2} />
        </mesh>
      </group>
    </>
  );
}

/** The hero's 3D yantra. Loaded with next/dynamic (ssr: false) by HeroSacredGeometry. */
export default function SriYantraCanvas({ active, ...props }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <Yantra {...props} />
    </Canvas>
  );
}
