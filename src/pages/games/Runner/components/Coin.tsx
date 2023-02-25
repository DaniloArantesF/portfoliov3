import * as THREE from 'three';
import { useRef, RefObject, useState, useLayoutEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useStore } from '../lib/store';
import { useFrame } from '@react-three/fiber';

interface CoinProps {
  position: THREE.Vector3;
  tileIndex: number;
  tile: RefObject<THREE.Mesh | THREE.Group>;
  run: number;
}

function Coin({
  position: initialPosition,
  tileIndex,
  tile,
  ...props
}: CoinProps) {
  const tileLength = useStore((state) => state.tileLength);
  const incScore = useStore((state) => state.incScore);
  const args: TScene.Vec3 = [0.5, 10, 10];
  const position = useRef(
    new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z),
  );

  const [visible, setVisible] = useState(true);
  const curRun = useRef(props.run);
  const tileData = useStore((state) => state.tiles[tileIndex]);

  const ref = useRef<THREE.Mesh>(null);
  const [_, api] = useSphere(() => ({
    position: [position.current.x, position.current.y, tileIndex * tileLength],
    mass: 0,
    isTrigger: true,
    args: [args[0] + 0.1],
    onCollideBegin: () => {
      if (!visible) return;
      incScore();
      setVisible(false);
    },
  }));

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.visible = visible;
  }, [visible]);

  useFrame(() => {
    if (!ref.current) return;
    position.current.x = initialPosition.x;
    position.current.z = ref.current.parent!.position.z;

    if (curRun.current !== tileData.run) {
      setVisible(true);
      curRun.current = tileData.run;
    }
    updateColliders();
  });

  function updateColliders() {
    if (!ref.current) return;
    api.position.copy(position.current);
    ref.current.position.x = position.current.x;
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
