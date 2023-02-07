import { Canvas, MeshProps, useFrame } from '@react-three/fiber';
import {
  PerspectiveCamera,
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Sky,
} from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';

const SCROLLING_SPEED = 0.1;
const TILE_LENGTH = 10;
const TILE_COUNT = 10;
const BOUNDS = {
  x: (TILE_LENGTH * TILE_COUNT) / 2,
  z: (TILE_LENGTH * TILE_COUNT) / 2,
};

export function Box() {
  const boxRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (!boxRef.current) return;
  });
  return (
    <mesh ref={boxRef} position={[0, 1, -1]}>
      <boxGeometry attach="geometry" />
      <meshPhongMaterial attach="material" color="yellow" />
    </mesh>
  );
}

const Tile = ({ color, ...props }: MeshProps & { color: string }) => {
  const ref = useRef<Mesh>(null);

  return (
    <mesh ref={ref} {...props}>
      <planeGeometry
        attach="geometry"
        args={[TILE_LENGTH, TILE_LENGTH, 100, 100]}
      />
      <meshPhongMaterial
        attach="material"
        color={color}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export function Ground() {
  const offset = useRef(0);
  const groundRef = useRef<Group>(null);
  const tiles = useMemo(
    () =>
      [...new Array(TILE_COUNT)].map((_, i) => ({
        position: [0, 0, i * TILE_LENGTH] as [number, number, number],
        children: null,
        color: ['red', 'green', 'blue'][i % 3],
      })),
    [],
  );

  useFrame((state) => {
    if (!groundRef.current) return;

    groundRef.current.children.forEach((tile) => {
      if (tile.position.z < -1 * BOUNDS.z) {
        tile.position.z = BOUNDS.z;
      } else {
        tile.position.z -= SCROLLING_SPEED;
      }
    });
  });

  return (
    <group ref={groundRef} position={[0, 0, 0]}>
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          position={[...tile.position]}
          color={tile.color}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      ))}
    </group>
  );
}

export default function Scene() {
  return (
    <div id="r3f-canvas-container" style={{ height: '100%' }}>
      <Canvas>
        <PerspectiveCamera makeDefault fov={75} position={[0, 6, -5]} />
        <Suspense fallback={null}>
          <Box />
          <Ground />
        </Suspense>
        <ambientLight args={[0xffffff]} intensity={0.5} />
        <fog attach="fog" args={['white', 0, 500]} />
        <Sky sunPosition={[100, 10, 100]} distance={1000} />
        <OrbitControls />
        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor="black"
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
