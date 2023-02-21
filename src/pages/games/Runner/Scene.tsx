import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, KeyboardControls } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { Physics, Debug } from '@react-three/cannon';
import { Player } from './components/Player';
import { GUI, SceneUtils } from './utils';
import { useStore } from './store';
import { Track } from './components/Track';
import Score from './components/Score';
import Lights from './components/Lights';
import { keyboardControlsMap } from './config';
import Menu from './components/Menu';
import GameOver from './components/GameOver';
import Overlay from './components/Overlay';
import { useGameStateManager } from './hooks/gameStateManager';
import CameraRig from './components/CameraRig';

function Scene() {
  const { debug } = useStore();
  const { status, run, startGame } = useGameStateManager();

  const scene = useMemo(
    () => (
      <>
        <Score />
        <Player />
        <Track />
      </>
    ),
    [],
  );

  return (
    <>
      <GUI />
      <Menu />
      <GameOver />
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
          <Canvas>
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
            <fog attach="fog" args={['white', 0, 500]} />
            <SceneUtils />
            {/* <Effects /> */}
          </Canvas>
        </KeyboardControls>
      </div>
    </>
  );
}

export default Scene;
