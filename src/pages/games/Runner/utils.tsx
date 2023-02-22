import {
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Stats,
} from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useTweaks, makeButton } from 'use-tweaks';
import { useStore } from './lib/store';

export function GUI() {
  const ref = useRef<HTMLDivElement>(null);
  const { debug, set, get } = useStore();

  const {} = useTweaks(
    'Scene',
    {
      ...makeButton('Debug', () => set({ debug: !get().debug })),
    },
    { container: ref },
  );

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 'var(--header-height)',
        left: '2rem',
        zIndex: 999,
        width: 310,
      }}
    />
  );
}

export function SceneUtils() {
  const { orbitControls } = useStore();

  return (
    <>
      <Stats />
      <OrbitControls target={[0, 6, 0]} enabled={orbitControls} />
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport
          axisColors={['red', 'green', 'blue']}
          labelColor="black"
        />
      </GizmoHelper>
    </>
  );
}
