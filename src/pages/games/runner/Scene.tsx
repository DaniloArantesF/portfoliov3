import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Stars } from '@react-three/drei';
import React, { Suspense, useMemo } from 'react';
import { Physics, Debug } from '@react-three/cannon';
import { Player } from '@lib/Runner/components/Player';
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

function Scene() {
  const { status, run, startGame, debug } = useStore();
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
    <>
      <GameOver />
      <UI>
        <Clock />
        <Score />
        <Speed />
      </UI>
      <GUI />
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
            {/* <fog attach="fog" args={['white', 0, 500]} /> */}
            {/* <Effects /> */}
          </Canvas>
        </KeyboardControls>
      </div>
    </>
  );
}

export default Scene;
