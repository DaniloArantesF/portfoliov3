import { Canvas, extend } from '@react-three/fiber';
import {
  Backdrop,
  Environment,
  Lightformer,
  Loader,
  OrbitControls,
  Stats,
} from '@react-three/drei';
import {
  PermissionsPrompt,
  useDeviceOrientation,
} from '~/lib/DeviceOrientation';
import { Model } from './Watch';

function Scene() {
  const { alpha, beta, gamma } = useDeviceOrientation();

  return (
    <>
      <div className="absolute top-16 left-4 z-40">
        <div className="sensor_data">
          <div>alpha(z):{alpha}</div>
          <div>beta(x): {beta}</div>
          <div>gamma(y): {gamma}</div>
        </div>
        <PermissionsPrompt />
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
          <Canvas shadows id="app-view" className="min-h-[100dvh] h-full">
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
            <OrbitControls />
            <Model />
            <Backdrop
              receiveShadow
              floor={1} // Stretches the floor segment, 0.25 by default
              segments={20} // Mesh-resolution, 20 by default
              position={[0, -1, -1]}
              scale={[10, 3, 1]}
            >
              <meshStandardMaterial color="#203F58" />
            </Backdrop>

            {/* <Effects /> */}
          </Canvas>
        </div>
      </div>
    </>
  );
}

export default Scene;
