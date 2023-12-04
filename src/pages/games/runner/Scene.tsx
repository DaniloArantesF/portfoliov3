import { Canvas } from '@react-three/fiber';
import { KeyboardControls, OrbitControls, Stars } from '@react-three/drei';
import React, { Suspense, useMemo, useRef } from 'react';
import { Physics, Debug } from '@react-three/cannon';
import {
  DOWN_VELOCITY,
  JUMP_VELOCITY,
  Player,
} from '@lib/Runner/components/Player';
import { GUI, SceneUtils } from '@lib/Runner/lib/utils';
import { useStore, keyboardControlsMap } from '@lib/Runner/lib/store';
import Track from '@lib/Runner/components/Track';
import Score from '@lib/Runner/components/Score';
import Lights from '@lib/Runner/components/Lights';
import Menu from '@lib/Runner/components/Menu';
import GameOver from '@lib/Runner/components/GameOver';
import Overlay from '@lib/Runner/components/Overlay';
import CameraRig from '@lib/Runner/components/CameraRig';
import UI from '@lib/Runner/components/ui';
import Speed from '@lib/Runner/components/Speed';
import Clock from '@lib/Runner/components/Clock';
import { useDrag } from '@use-gesture/react';
import { clamp } from '~/utils/math';

function Scene() {
  const { set, status, run, startGame, debug, playerVelocity } = useStore();
  const debugRef = useRef(null);
  const bind = useDrag(
    (state) => {
      const {
        swipe, // [swipeX, swipeY] 0 if no swipe detected, -1 or 1 otherwise
      } = state;

      if (!playerVelocity.current) return;

      let curTrack = useStore.getState().curTrack;
      if (swipe[0] === -1) {
        curTrack = clamp(
          curTrack + 1,
          0,
          useStore.getState().tracks.length - 1,
        );
        set({ curTrack: curTrack });
      } else if (swipe[0] === 1) {
        curTrack = clamp(
          curTrack - 1,
          0,
          useStore.getState().tracks.length - 1,
        );
        set({ curTrack: curTrack });
      }

      if (swipe[1] === -1 && !useStore.getState().playerJumping) {
        playerVelocity.current[1] = JUMP_VELOCITY;
        set({ playerJumping: true });
      } else if (swipe[1] === 1 && useStore.getState().playerJumping) {
        playerVelocity.current[1] = DOWN_VELOCITY;
      }
    },
    {
      pointer: {
        touch: true,
      },
    },
  );

  const scene = useMemo(
    () => (
      <>
        <Player />
        <Track />
        <Stars />
      </>
    ),
    [],
  );

  return (
    <div
      {...bind()}
      style={{ height: '100vh', touchAction: 'none', userSelect: 'none' }}
    >
      <GameOver />
      <UI>
        <Clock />
        <Score />
        <Speed />
        <div ref={debugRef}></div>
      </UI>

      {/* <GUI /> */}
      <Menu />

      {status === 'idle' && (
        <Overlay
          onClick={() => startGame()}
          style={{ backdropFilter: 'none', zIndex: 99 }}
        >
          Click anywhere to start
        </Overlay>
      )}
      <div id="r3f-canvas-container" style={{ height: '100%' }}>
        <KeyboardControls map={keyboardControlsMap}>
          <Canvas frameloop="demand">
            <CameraRig />
            <Suspense fallback={null} key={run}>
              <Physics
                broadphase="SAP"
                defaultContactMaterial={{ friction: 0.5, restitution: 0.1 }}
              >
                {debug ? <Debug>{scene}</Debug> : scene}
              </Physics>
            </Suspense>
            <Lights />
            <SceneUtils />
            {/* <fog attach="fog" args={['#4c4c9f', 0, 500]} /> */}
            {/* <Effects /> */}
            {/* <OrbitControls /> */}
          </Canvas>
        </KeyboardControls>
      </div>
    </div>
  );
}

export default Scene;
