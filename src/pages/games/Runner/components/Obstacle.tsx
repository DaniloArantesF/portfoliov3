import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COLLIDER_HEIGHT } from '../config';
import { useGameStateManager } from '../hooks/gameStateManager';

interface ObstacleProps {
  tileIndex: number;
  position: THREE.Vector3;
  visible: boolean;
  run: number;
}

function Obstacle(props: ObstacleProps) {
  const position = useRef(props.position);
  const { endGame, status } = useGameStateManager();
  const obstacleArgs = useMemo<TScene.Vec3>(() => [3, COLLIDER_HEIGHT, 1], []);
  const obstacleRef = useRef<THREE.Mesh>(null);
  const [_, obstacleApi] = useBox(() => ({
    args: obstacleArgs,
    position: position.current.toArray(),
    isTrigger: true,
    onCollideBegin: () => {
      endGame();
    },
  }));
  const run = useRef(props.run);

  useLayoutEffect(() => {
    obstacleRef.current!.visible = props.visible;
  }, [props.visible]);

  useFrame(() => {
    if (!obstacleRef.current) return;

    if (run.current !== props.run) {
      position.current.x = props.position.x;
      run.current = props.run;
    }

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
