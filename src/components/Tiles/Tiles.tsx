import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ProjectProps } from '~/pages/projects.astro';
import classes from './Tiles.module.css';
import { Html } from '@react-three/drei';
import type { HtmlProps } from '@react-three/drei/web/Html';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Group } from 'three';

function SceneSetup() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
    </>
  );
}

const Tile = ({
  project,
  index,
  ...props
}: { project: ProjectProps; index: number } & HtmlProps) => {
  const tileRef = useRef(null);

  return (
    <Html ref={tileRef} className={classes.tile} transform {...props}>
      <img src={`/assets/${project.image}`}></img>
    </Html>
  );
};

export type TilesProps = {
  tileWidth?: number;
  data: ProjectProps[];
};

export const Tiles = ({ data, tileWidth = 23 }: TilesProps) => {
  const groupRef = useRef<Group>(null);
  const radius = tileWidth * 3;
  const totalTiles = data.length;
  const initialShift = Math.PI / 2;
  const angleStep = (2 * Math.PI) / totalTiles;
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const scrollDiv = document.getElementById('scroll');
    if (!scrollDiv) return;

    const handleScroll = () => setScroll(scrollDiv.scrollTop * 0.2);
    scrollDiv.addEventListener('scroll', handleScroll);
    return () => scrollDiv.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((tile, index) => {
      const angle = index * angleStep + initialShift + scroll / (Math.PI * 8);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const y = Math.sin(
        state.clock.elapsedTime +
          index * (groupRef.current?.children.length ?? 0),
      );
      tile.position.set(x, y * 1, z);
    });
  });

  const items = useMemo(
    () =>
      data.map((p, index) => (
        <Tile key={index} index={index} project={p} scale={[1, 1, 1]} />
      )),
    [data],
  );

  return <group ref={groupRef}>{items}</group>;
};

export const TilesScene = ({ data }: TilesProps) => {
  return (
    <div className={classes.tiles}>
      <div
        id="scroll"
        style={{
          height: '100%',
          maxHeight: '100vh',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 23 * 3.65] }}
          className={classes.canvas}
        >
          <SceneSetup />
          <Tiles data={data} />
          <gridHelper args={[20, 20, 0xff0000, 'teal']} />
          {/* <OrbitControls enablePan={false} /> */}
        </Canvas>
        <div style={{ height: '100vh' }}></div>
      </div>
    </div>
  );
};
