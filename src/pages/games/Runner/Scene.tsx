/// <reference path="types.d.ts" />
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Sky, KeyboardControls } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';
import { Physics, Debug } from '@react-three/cannon';
import { Player } from './components/Player';
import { GUI, SceneUtils } from './utils';
import { useStore } from './store';
import { Track } from './components/Track';

export const SCROLLING_SPEED = 0.1;
export const TILE_LENGTH = 10;
export const TILE_WIDTH = 15;
export const TILE_HEIGHT = 2;
export const TILE_COUNT = 20;
export const BOUNDS = {
  x: (TILE_COUNT * TILE_LENGTH) / 2,
  z: (TILE_COUNT * TILE_LENGTH) / 2,
};
export const COLLIDER_HEIGHT = 2;
export const TRACK_COUNT = 3;
export const TRACK_WIDTH = TILE_WIDTH / TRACK_COUNT;

export const track1 = new THREE.Vector3(-TRACK_WIDTH / 2, 3, 0);
export const track2 = new THREE.Vector3(0, 3, 0);
export const track3 = new THREE.Vector3(TRACK_WIDTH / 2, 3, 0);

export const keyboardControlsMap = [
  { name: 'left', keys: ['ArrowLeft', 'a'] },
  { name: 'right', keys: ['ArrowRight', 'd'] },
  { name: 'up', keys: ['ArrowUp', 'Space'] },
  { name: 'down', keys: ['ArrowDown', 'Shift'] },
];

function Scene() {
  const { debug } = useStore();
  const scene = useMemo(
    () => (
      <>
        <Player />
        <Track />
      </>
    ),
    [],
  );

  return (
    <>
      <GUI />
      <div id="r3f-canvas-container" style={{ height: '100%' }}>
        <KeyboardControls map={keyboardControlsMap}>
          <Canvas>
            <PerspectiveCamera
              makeDefault
              fov={75}
              position={[0, 3.5, -5]}
              rotation={[0, Math.PI, 0]}
            />
            <Suspense fallback={null}>
              <Physics
                broadphase="SAP"
                defaultContactMaterial={{ friction: 0.5, restitution: 0.1 }}
              >
                {debug ? <Debug>{scene}</Debug> : scene}
              </Physics>
            </Suspense>
            <ambientLight args={[0xffffff]} intensity={0.3} />
            <fog attach="fog" args={['white', 0, 500]} />
            <Sky sunPosition={[100, 50, 100]} distance={1000} />
            <SceneUtils />
          </Canvas>
        </KeyboardControls>
      </div>
    </>
  );
}

export default Scene;
