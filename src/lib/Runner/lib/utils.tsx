import {
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Stats,
  Grid,
} from '@react-three/drei';
import { useRef } from 'react';
import { useTweaks } from 'use-tweaks';
import { useStore } from './store';

export function GUI() {
  const ref = useRef<HTMLDivElement>(null);
  const { debug, set, get } = useStore();

  const {} = useTweaks(
    'Scene',
    {
      // ...makeButton('Debug', () => set({ debug: !get().debug })),
    },
    {
      container: (ref === null ? undefined : ref) as
        | React.RefObject<HTMLDivElement>
        | undefined,
    },
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
      {orbitControls && (
        <OrbitControls target={[0, 2, 0]} enabled={orbitControls} />
      )}
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport
          axisColors={['red', 'green', 'blue']}
          labelColor="black"
        />
      </GizmoHelper>
      {/* <Grid args={[100, 100, 100]} /> */}
    </>
  );
}
