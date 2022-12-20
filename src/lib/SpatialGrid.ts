import { clamp } from '@utils/math';
import * as THREE from 'three';

interface SpatialGridParams {
  bounds: [THREE.Vector3, THREE.Vector3];
  dimensions: [number, number]; // [x, y] cell count
}

interface SpatialGridItem {
  position: THREE.Vector3;
}

class SpatialGrid<T extends SpatialGridItem> {
  private cells: { [id: string]: T }[][];
  private entities: T[];
  private cellSize: THREE.Vector3;
  private bounds: [THREE.Vector3, THREE.Vector3];
  private dimensions: [number, number];

  constructor({ bounds, dimensions }: SpatialGridParams) {
    this.cells = Array(dimensions[0])
      .fill(0)
      .map(() =>
        Array(dimensions[1])
          .fill(0)
          .map(() => ({})),
      );
    this.entities = [];
    this.bounds = bounds;
    this.dimensions = dimensions;
    this.cellSize = bounds[1].clone().sub(bounds[0]);
    this.cellSize.multiply(
      new THREE.Vector3(1 / dimensions[0], 1, 1 / dimensions[1]),
    );
  }

  addEntity(entity: T) {
    this.entities.push(entity);
  }

  getEntities() {
    return [...this.entities];
  }

  // Updates the position of an item in the grid by adding it to the cell
  // corresponding to its position and removing it from its previous cell
  // (if specified).
  updateEntityPosition(
    id: string,
    entity: T,
    previous?: [number, number],
  ): [number, number] {
    const [x, y] = this.getCellIndex(entity.position);

    if (previous) {
      const [prevX, prevY] = previous;
      if (prevX == x && prevY == y) {
        return [x, y];
      }
      delete this.cells[prevX][prevY][id];
    }

    this.cells[x][y][id] = entity;
    return [x, y];
  }

  // Returns all the items within a certain radius of a given position.
  getLocalEntities(position: THREE.Vector3, radius: number) {
    const [x, y] = this.getCellIndex(position);

    const cellSize = Math.min(this.cellSize.x, this.cellSize.z);
    const cells = Math.ceil(radius / cellSize);

    let local = [];

    const xMin = Math.max(x - cells, 0),
      xMax = Math.min(this.dimensions[0] - 1, x + cells);
    const yMin = Math.max(y - cells, 0),
      yMax = Math.min(this.dimensions[1] - 1, y + cells);

    for (let i = xMin; i <= xMax; i++) {
      for (let j = yMin; j <= yMax; j++) {
        local.push(...Object.values(this.cells[i][j]));
      }
    }

    // Filter remaining entities
    local = local.filter((l) => {
      const distance = l.position.distanceTo(position);
      return distance !== 0 && distance <= radius;
    });

    return local;
  }

  // Given a position, returns the index of the cell that the position belongs to.
  getCellIndex(position: THREE.Vector3) {
    const x = clamp(
      (this.bounds[0].x - position.x) / (this.bounds[0].x - this.bounds[1].x),
      0,
      1,
    );
    const y = clamp(
      (this.bounds[0].z - position.z) / (this.bounds[0].z - this.bounds[1].z),
      0,
      1,
    );

    const xIndex = Math.floor(x * (this.dimensions[0] - 1));
    const yIndex = Math.floor(y * (this.dimensions[1] - 1));
    return [xIndex, yIndex];
  }
}

export default SpatialGrid;
