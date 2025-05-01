import { Canvas } from '@react-three/fiber';
import {
  Backdrop,
  ContactShadows,
  Environment,
  Lightformer,
  Loader,
  PresentationControls,
} from '@react-three/drei';
import {
  PermissionsPrompt as DeviceOrientationPermission,
  useDeviceOrientation,
} from '~/lib/DeviceOrientation';
import { Model } from './Watch';
import React from 'react';

function Scene() {
  const { alpha, beta, gamma } = useDeviceOrientation();
  const guiRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="absolute top-16 left-4 z-40 bg-surface-3 p-4 rounded-md flex flex-col gap-4">
        <div>
          <div>Alpha(z):{alpha.toFixed(2)}</div>
          <div>Beta(x): {beta.toFixed(2)}</div>
          <div>Gamma(y): {gamma.toFixed(2)}</div>
        </div>
        <DeviceOrientationPermission />
      </div>
      <Loader
        containerStyles={{
          background: `var(--color-background)`,
        }}
        barStyles={{
          backgroundColor: 'var(--color-accent)',
          borderRadius: 'var(--border-radius)',
          transition: 'width 0.3s ease-in-out',
          backgroundImage:
            'linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-2) 100%)',
        }}
      />
      <div className="w-full" style={{ height: '100vh', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <Canvas
            shadows
            id="app-view"
            className="min-h-[100dvh] h-full"
            camera={{
              position: [0, -0.15, 1],
            }}
          >
            <ambientLight intensity={0.1} />
            {/* <Stats showPanel={0} className="stats" /> */}

            <spotLight
              intensity={0.9}
              angle={0.1}
              penumbra={1}
              position={[10, 15, 10]}
              castShadow
            />
            <Environment resolution={512}>
              {/* Ceiling */}
              <Lightformer
                intensity={2}
                rotation-x={Math.PI / 2}
                position={[0, 4, -9]}
                scale={[10, 1, 1]}
              />
              <Lightformer
                intensity={2}
                rotation-x={Math.PI / 2}
                position={[0, 4, -6]}
                scale={[10, 1, 1]}
              />
              <Lightformer
                intensity={2}
                rotation-x={Math.PI / 2}
                position={[0, 4, -3]}
                scale={[10, 1, 1]}
              />
              <Lightformer
                intensity={2}
                rotation-x={Math.PI / 2}
                position={[0, 4, 0]}
                scale={[10, 1, 1]}
              />
              <Lightformer
                intensity={2}
                rotation-x={Math.PI / 2}
                position={[0, 4, 3]}
                scale={[10, 1, 1]}
              />
              <Lightformer
                intensity={10}
                rotation-x={Math.PI / 2}
                position={[0, 0.5, 6]}
                scale={[10, 1, 1]}
              />
              <Lightformer
                intensity={10}
                rotation-x={Math.PI / 2}
                position={[0, 0.5, 9]}
                scale={[10, 1, 1]}
              />
              {/* Sides */}
              <Lightformer
                intensity={5}
                rotation-y={Math.PI / 2}
                position={[-30, 0.5, 0]}
                scale={[100, 2, 1]}
              />
              <Lightformer
                intensity={5}
                rotation-y={-Math.PI / 2}
                position={[30, 0.5, 0]}
                scale={[100, 2, 1]}
              />
              {/* Key */}
              <Lightformer
                form="ring"
                color="white"
                intensity={30}
                scale={2}
                position={[10, 2.5, 10]}
                onUpdate={(self) => self.lookAt(0, 0, 0)}
              />
            </Environment>
            {/* <OrbitControls></OrbitControls> */}
            <PresentationControls
              global
              // config={{ mass: 2, tension: 500 }}
              rotation={[0, 0.3, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 2]}
              zoom={1.5}
            >
              <Model />
            </PresentationControls>
            <Backdrop
              receiveShadow
              floor={1}
              segments={20}
              position={[0, -1, -1.75]}
              scale={[20, 10, 10]}
            >
              <meshStandardMaterial color="#203F58" />
            </Backdrop>
            <ContactShadows
              position={[0, -0.75, 0]}
              opacity={0.75}
              scale={10}
              blur={1.5}
              far={5}
            />

            {/* <Effects /> */}
          </Canvas>
        </div>
      </div>
    </>
  );
}

export default Scene;
