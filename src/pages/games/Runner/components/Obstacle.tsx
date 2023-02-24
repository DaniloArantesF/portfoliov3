import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useStore } from '../lib/store';

interface ObstacleProps {
  tileIndex: number;
  position: THREE.Vector3;
  visible: boolean;
  run: number;
}

export const SAFE_ZONE = 5;

function Obstacle(props: ObstacleProps) {
  const { tiles, endGame, colliderHeight, tileLength } = useStore();
  const position = useRef(props.position);
  const obstacleRef = useRef<THREE.Mesh>(null);
  const obstacleArgs = useMemo<TScene.Vec3>(() => [3, colliderHeight, 1], []);

  const [isVisible, setIsVisible] = useState(props.visible);
  const tile = tiles[props.tileIndex];

  const [_, obstacleApi] = useBox(() => ({
    args: obstacleArgs,
    position: [
      position.current.x,
      position.current.y,
      props.tileIndex * tileLength,
    ],
    isTrigger: true,
    onCollideBegin: () => {
      const { run, index } = useStore.getState().tiles[props.tileIndex];
      const status = useStore.getState().status;
      if (status !== 'running' || (run === 0 && index <= SAFE_ZONE)) return;
      endGame();
    },
  }));

  useLayoutEffect(() => {
    if (tile.run > 0 && tile.index <= SAFE_ZONE) {
      setIsVisible(true);
    }
  }, [tile]);

  useLayoutEffect(() => {
    obstacleRef.current!.visible = isVisible;
  }, [isVisible]);

  useFrame(() => {
    if (!obstacleRef.current) return;
    position.current.x = props.position.x;
    position.current.z = obstacleRef.current.parent!.position.z;
    updateColliders();
  });

  // Update collider position
  function updateColliders() {
    if (!obstacleRef.current) return;
    obstacleApi.position.copy(position.current);
    obstacleRef.current.position.x = position.current.x;
  }

  return (
    <mesh ref={obstacleRef} name={'obstacle'} position={position.current}>
      <boxGeometry attach="geometry" args={obstacleArgs} />
      <meshPhongMaterial
        attach="material"
        color="yellow"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default Obstacle;
