import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { ProjectProps } from '~/pages/projects.astro';
import { Mesh, Color } from 'three';
import classes from './Tiles.module.css';
import { OrbitControls } from '@react-three/drei';

function Box(props: any) {
  const ref = useRef<Mesh>(null);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta;
  });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

function SceneSetup() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
    </>
  );
}

export type TilesProps = {
  data: ProjectProps[];
};

export const Tiles = ({ data }: TilesProps) => {
  return (
    <div className={classes.tiles}>
      <Canvas>
        <SceneSetup />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <gridHelper args={[20, 20, 0xff0000, 'teal']} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};
