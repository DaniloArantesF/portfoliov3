import * as THREE from 'three';
import Image from './Image';

interface GalleryProps {
  pictures: { src: string }[];
  uniforms: any;
  tileWidth: number;
  gap: number;
  position: number;
}

const Gallery = ({
  position: scrollPosition,
  pictures,
  uniforms,
  tileWidth,
  gap,
}: GalleryProps) => {
  const galleryGroup = new THREE.Group();

  const totalTileWidth = tileWidth + gap;
  for (let i = 0; i < pictures.length; i++) {
    let position = new THREE.Vector3(i * totalTileWidth, 0, 0);
    // const width = scrollPosition * 10 === i ? 1 : tileWidth;
    galleryGroup.add(
      Image({
        url: pictures[i].src,
        uniforms,
        position,
        scale: new THREE.Vector3(tileWidth, 1, 1),
      }),
    );
  }

  return galleryGroup;
};

export default Gallery;
