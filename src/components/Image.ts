import * as THREE from 'three';
import imageFragmentShader from '../pages/projects/Tiles/shaders/image.fs.glsl?raw';
import imageVertexShader from '../pages/projects/Tiles/shaders/image.vs.glsl?raw';

type ImageProps = Partial<Omit<THREE.Mesh, 'scale'>> & {
  scale?: THREE.Vector3;
  color?: THREE.Color;
  zoom?: number;
  grayscale?: number;
  url: string;
  uniforms: any;
};

const Image: (props: ImageProps) => THREE.Mesh = ({
  url,
  uniforms,
  position = new THREE.Vector3(0, 0, 0),
  scale = new THREE.Vector3(0.3, 1, 1),
  color = new THREE.Color(255, 255, 255),
  zoom = 1,
  grayscale = 0,
}) => {
  const imageSize = new THREE.Vector2(4, 3); // TODO: improve this
  const texture = new THREE.TextureLoader().load(url);
  const geometry = new THREE.PlaneGeometry(1, 1, 5, 5);

  // texture encoding?
  const material = new THREE.ShaderMaterial({
    vertexShader: imageVertexShader,
    fragmentShader: imageFragmentShader,
    uniforms: {
      ...uniforms,
      imageSize: { value: imageSize },
      color: { value: color },
      scale: { value: scale },
      zoom: { value: zoom },
      grayscale: { value: grayscale },
      opacity: { value: 1 },
      map: {
        value: texture,
      },
    },
    side: THREE.DoubleSide,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.scale.copy(scale);

  return mesh;
};

export default Image;
