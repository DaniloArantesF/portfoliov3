import * as THREE from 'three';

export const fibonacciSphereV3 = (samples: number, scale: number) => {
  const gAng = 2.399963229728; // [golden angle: pi * (3 - sqrt(5))]
  const points = [];
  for (let i = 0; i < samples; i++) {
    const y = 1.0 - (i / (samples - 1)) * 2.0;
    const radius = Math.sqrt(1.0 - y * y);
    const theta = gAng * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const v3 = new THREE.Vector3(x * scale, y * scale, z * scale);
    points.push(v3);
  }
  return points;
};
