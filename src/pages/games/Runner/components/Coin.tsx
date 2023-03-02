import * as THREE from 'three';
import {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
} from 'react';
import { useSphere } from '@react-three/cannon';
import { useStore } from '../lib/store';
import { useFrame } from '@react-three/fiber';

interface CoinProps {
  position: THREE.Vector3;
  tileIndex: number;
  wrapCount: number;
  index: number;
}

const args: [number] = [0.5];

function Coin(props: CoinProps) {
  const ref = useRef<THREE.Mesh>(null);
  const position = useRef<THREE.Vector3>(props.position.clone());
  const { tileLength, incScore } = useStore();
  const tilesRef = useRef(useStore.getState().tiles);
  const wrapCount = useRef(
    useStore.getState().tiles[props.tileIndex].wrapCount,
  );
  const tiles = useMemo(() => tilesRef.current, []);
  const groupRef = useMemo(() => tiles[props.tileIndex].group, [tiles]);

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
    useStore.subscribe(() => {
      tilesRef.current = useStore.getState().tiles;

      // Update to new coin position and reset visibility
      if (tilesRef.current[props.tileIndex].wrapCount !== wrapCount.current) {
        const coin = tilesRef.current[props.tileIndex].obstacles[props.index];
        wrapCount.current = tilesRef.current[props.tileIndex].wrapCount;
        position.current.x = coin.position.x;
        position.current.z = coin.position.z;
        ref.current?.position.copy(position.current);
        updateColliderPosition();
        resetCoinVisibility();
      }
    });
  }, []);

  useFrame(() => {
    updateColliderPosition();
  });

  function resetCoinVisibility() {
    position.current = props.position.clone();
    setVisible(true);
  }

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
