import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../lib/store';

interface ObstacleProps {
  tileIndex: number;
  position: THREE.Vector3;
  // visible: boolean;
  wrapCount: number;
  args: [number, number, number];
}

export const SAFE_ZONE = 5;

function Obstacle(props: ObstacleProps) {
  const obstacleRef = useRef<THREE.Mesh>(null);
  const position = useRef<THREE.Vector3>(props.position.clone());
  const { tiles, tileLength } = useStore();
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
    onCollideBegin: () => {
      const { status, endGame } = useStore.getState();
      if (status === 'running') endGame();
    },
  }));

  useFrame(() => {
    updateColliderPosition();
  });

  function updateColliderPosition() {
    const groupPosition =
      groupRef.current?.position.clone() || new THREE.Vector3();
    // if (props.tileIndex ===0) console.log(groupRef.current)
    api.position.set(
      props.position.x,
      props.position.y,
      groupPosition.z + props.position.z,
    );
  }

  return (
    <mesh ref={obstacleRef} name={'obstacle'} position={position.current}>
      <boxGeometry attach="geometry" args={props.args} />
      <meshPhongMaterial
        attach="material"
        color="cyan"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default Obstacle;
