import * as THREE from 'three';
import { useRef } from 'react';
import { useSphere } from '@react-three/cannon';

function Coin() {
  const args: TScene.Vec3 = [1, 10, 10];
  const [ref, api] = useSphere(
    () => ({
      mass: 0,
      isTrigger: true,
      args: [args[0]],
    }),
    useRef<THREE.Mesh>(null),
  );

  return (
    <mesh ref={ref} name={'coin'}>
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
