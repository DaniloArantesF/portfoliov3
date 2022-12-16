import * as THREE from 'three';

interface Position {
  x: number;
  y: number;
}

interface PickHelperProps {
  canvas: HTMLCanvasElement;
}

const PickHelper = ({ canvas }: PickHelperProps) => {
  let raycaster: THREE.Raycaster;
  let pickPosition: Position;
  let pickedObject: THREE.Object3D | null;

  function init() {
    raycaster = new THREE.Raycaster();
    pickPosition = { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY };

    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);
  }

  function pick(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    selected?: THREE.Object3D[],
  ) {
    if (pickedObject) {
      pickedObject = null;
    }
    // Cast ray through frustum at mouse position
    raycaster.setFromCamera(pickPosition, camera);

    // Get objects intersected by ray
    const intersectedObjects = raycaster.intersectObjects(
      selected ? selected : scene.children,
    );

    if (intersectedObjects.length) {
      if (intersectedObjects[0].object.type === 'GridHelper') return;
      // Pick the closest object (will be the first)
      pickedObject = intersectedObjects[0].object;
    }
    return pickedObject;
  }

  function setPickPosition(event: MouseEvent) {
    const pos = getCanvasRelativePosition(event);

    // Normalize relative position
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1; // Need to reflect Y
  }

  function clearPickPosition() {
    pickPosition = { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY };
  }

  function getCanvasRelativePosition({ clientX, clientY }: MouseEvent) {
    const { left, top } = canvas.getBoundingClientRect();
    return {
      x: clientX - left,
      y: clientY - top,
    };
  }

  init();
  return { pick };
};

export default PickHelper;
