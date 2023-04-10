import { useEffect, useMemo, useRef, useState } from 'react';
import { useSphere } from '@react-three/cannon';
import type { SphereProps } from '@react-three/cannon';
import type { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

function generateRandomBall() {
  return {
    position: [0, Math.random() * 20 + 5, Math.random() * 2] as [
      number,
      number,
      number,
    ],
    args: [1] as [number],
    color: 'red',
  };
}

export function Balls() {
  const [balls, setBalls] = useState(() =>
    Array.from({ length: 1 }).map(generateRandomBall),
  );

  const addBall = () =>
    setBalls((curBalls) => [...curBalls, generateRandomBall()]);

  return (
    <>
      {balls.map((ball, i) => (
        <Ball key={i} {...ball} />
      ))}
    </>
  );
}

export function Ball(props: SphereProps & { color: string }) {
  const velocity = useRef([0, 0, 0]);
  const initialPosition = useMemo(
    () => props.position ?? [0, 0, 0],
    [props.position],
  );
  const position = useRef(initialPosition);
  const [ref, api] = useSphere(
    () => ({
      mass: 1,
      tension: 120,
      friction: 14,
      ...props,
    }),
    useRef<Mesh>(null),
  );

  useEffect(
    () => api.position.subscribe((pos) => (position.current = pos)),
    [],
  );

  useFrame((state) => {
    if (!position.current) return;

    if (position.current[1] < -50) {
      api.position.set(
        initialPosition[0],
        initialPosition[1],
        initialPosition[2],
      );
      api.velocity.set(0, 0, 0);
    }
  });

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <sphereGeometry args={[props.args ? props.args[0] : 1, 16, 16]} />
      <meshLambertMaterial color="white" />
    </mesh>
  );
}
