import * as THREE from 'three';
import imageFragmentShader from './shaders/image.fs.glsl?raw';
import imageVertexShader from './shaders/image.vs.glsl?raw';

//Omit<THREE.Mesh, 'scale'> //& {
//   segments?: number;
//   scale?: number | [number, number];
//   color?: THREE.Color;
//   zoom?: number;
//   grayscale?: number;
//   toneMapped?: boolean;
//   transparent?: boolean;
//   opacity?: number;
// } & (
//     | { texture: THREE.Texture; url?: never }
//     | { texture?: never; url: string }
//   ); // {texture: THREE.Texture} XOR {url: string}

type ImageProps = {
  uniforms: any;
};

const Image = ({ uniforms }: ImageProps) => {
  const texture = new THREE.TextureLoader().load(
    '/assets/projects/benji-demo-1.webp',
  );
  const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  const material = new THREE.ShaderMaterial({
    vertexShader: imageVertexShader,
    fragmentShader: imageFragmentShader,
    uniforms: {
      ...uniforms,
      map: {
        value: texture,
      },
    },
    side: THREE.DoubleSide,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

export default Image;
