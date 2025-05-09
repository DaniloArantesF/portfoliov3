import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../lib/store';

interface ObstacleProps {
  tileIndex: number;
  position: THREE.Vector3;
  // visible: boolean;
  wrapCount: number;
  args: [number, number, number];
  index: number;
}

export const SAFE_ZONE = 2;

function Obstacle(props: ObstacleProps) {
  const obstacleRef = useRef<THREE.Mesh>(null);
  const position = useRef<THREE.Vector3>(props.position.clone());
  const tilesRef = useRef(useStore.getState().tiles);
  const wrapCount = useRef(
    useStore.getState().tiles[props.tileIndex].wrapCount,
  );
  const tiles = useMemo(() => tilesRef.current, []);
  const isVisible = useRef(props.tileIndex > SAFE_ZONE);
  const { tileLength } = useStore();
  const groupRef = tiles[props.tileIndex].group;
  const [_, api] = useBox(() => ({
    type: 'Static',
    args: props.args,
    isTrigger: true,
    position: [
      props.position.x,
      props.position.y,
      props.tileIndex * tileLength + props.position.z,
    ],
    // TODO: define collide end or fix onCollide
    onCollideBegin: () => {
      if (!isVisible.current) return;
      const { status, endGame } = useStore.getState();
      if (status === 'running') endGame();
    },
    onCollideEnd: () => {
      if (!isVisible.current) return;
      const { status, endGame } = useStore.getState();
      if (status === 'running') endGame();
    },
  }));

  // If this is one of the first tiles, hide it until it wraps
  function updateObstacleVisibility() {
    if (!obstacleRef.current) return;
    obstacleRef.current!.visible = true;
    isVisible.current = true;
  }

  useLayoutEffect(() => {
    useStore.subscribe(() => {
      tilesRef.current = useStore.getState().tiles;

      // Update obstacle position
      if (tilesRef.current[props.tileIndex].wrapCount !== wrapCount.current) {
        const obstacle =
          tilesRef.current[props.tileIndex].obstacles[props.index];
        wrapCount.current = tilesRef.current[props.tileIndex].wrapCount;
        position.current.x = obstacle.position.x;
        position.current.z = obstacle.position.z;
        obstacleRef.current?.position.copy(position.current);
        updateColliderPosition();

        // Update obstacle visibility
        if (wrapCount.current == 1 && !isVisible.current) {
          updateObstacleVisibility();
        }
      }
    });
  }, []);

  useFrame(() => {
    updateColliderPosition();
  });

  function updateColliderPosition() {
    const groupPosition =
      groupRef.current?.position.clone() || new THREE.Vector3();
    api.position.set(
      position.current.x,
      position.current.y,
      groupPosition.z + position.current.z,
    );
  }

  return (
    <mesh
      ref={obstacleRef}
      name={'obstacle'}
      position={position.current}
      visible={isVisible.current}
    >
      <boxGeometry attach="geometry" args={props.args} />
      <meshPhongMaterial
        attach="material"
        color="hsl(350, 60%, 55%)"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default Obstacle;
