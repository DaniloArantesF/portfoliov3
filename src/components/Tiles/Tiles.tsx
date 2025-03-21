import { Canvas } from '@react-three/fiber';
import type { ProjectProps } from '~/pages/projects.astro';
import classes from './Tiles.module.css';
import { Html, OrbitControls } from '@react-three/drei';
import type { HtmlProps } from '@react-three/drei/web/Html';

function SceneSetup() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
    </>
  );
}

function Tile({ project, ...props }: { project: ProjectProps } & HtmlProps) {
  return (
    <Html transform scale={0.1} {...props}>
      <div className={classes.tile}>
        <img src={`/assets/${project.image}`}></img>
      </div>
    </Html>
  );
}

export type TilesProps = {
  data: ProjectProps[];
};

export const Tiles = ({ data }: TilesProps) => {
  const maxColumns = 3;
  const gap = 1;
  const scale = 1.5;

  const calculateTilePosition = (index: number): [number, number, number] => {
    const column = (index % maxColumns) - maxColumns / 2;
    const row = Math.floor(index / maxColumns);
    return [scale * column, scale * row, 0];
  };

  return (
    <div className={classes.tiles}>
      <Canvas>
        {data.map((p, index) => {
          return <Tile project={p} position={calculateTilePosition(index)} />;
        })}
        <SceneSetup />
        <gridHelper args={[20, 20, 0xff0000, 'teal']} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};
