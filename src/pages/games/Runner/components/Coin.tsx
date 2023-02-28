import * as THREE from 'three';
import {
  useRef,
  RefObject,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
} from 'react';
import { useBox, useSphere } from '@react-three/cannon';
import { useStore } from '../lib/store';
import { useFrame } from '@react-three/fiber';

interface CoinProps {
  position: THREE.Vector3;
  tileIndex: number;
  wrapCount: number;
}

const args: [number] = [0.5];

function Coin(props: CoinProps) {
  const ref = useRef<THREE.Mesh>(null);
  const position = useRef<THREE.Vector3>(props.position.clone());
  const { tiles, tileLength, incScore } = useStore();
  const groupRef = tiles[props.tileIndex].group;
  const curIteration = tiles[props.tileIndex].wrapCount;
  const [isVisible, setVisible] = useState(true);
  const [_, api] = useSphere(() => ({
    type: 'Static',
    args,
    isTrigger: true,
    position: [
      props.position.x,
      props.position.y,
      props.tileIndex * tileLength + props.position.z,
    ],
    onCollideBegin: () => {
      const { status } = useStore.getState();
      if (status === 'running' && isVisible) {
        setVisible(false);
      }
    },
  }));

  useEffect(() => {
    if (!isVisible && ref.current!.visible) {
      ref.current!.visible = false;
      incScore();
    } else {
      ref.current!.visible = true;
    }
  }, [isVisible]);

  useLayoutEffect(() => {
    if (props.tileIndex === 0) {
      console.log(props.position);
    }
    // console.log(`${props.tileIndex}-${curIteration}`)
    resetCoin();
  }, [curIteration]);

  useFrame(() => {
    updateColliderPosition();
  });

  function resetCoin() {
    position.current = props.position.clone();
    setVisible(true);
  }

  function updateColliderPosition() {
    const groupPosition =
      groupRef.current?.position.clone() || new THREE.Vector3();
    api.position.set(
      props.position.x,
      props.position.y,
      groupPosition.z + props.position.z,
    );
  }

  return (
    <mesh ref={ref} name={'coin'} position={position.current}>
      <sphereGeometry attach="geometry" args={args} />
      <meshPhongMaterial
        attach="material"
        color="yellow"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default Coin;
