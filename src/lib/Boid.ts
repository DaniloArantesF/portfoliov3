import { rand } from '@utils/math';
import * as THREE from 'three';
import type SpatialGrid from './SpatialGrid';

const BOID_FORCE_SEEK = 2;
const BOID_FORCE_ALIGNMENT = 10;
const BOID_FORCE_SEPARATION = 30;
const BOID_FORCE_COHESION = 10;
const BOID_FORCE_WANDER = 3;

export interface BoidParams {
  acceleration: number;
  bounds: { width: number; height: number; depth: number };
  hashGrid: SpatialGrid<Boid>;
  index: number;
  maxSteeringForce: number;
  speed: number;
  speedMax: number;
  speedMin: number;
}

class Boid {
  public group: THREE.Group;
  public position: THREE.Vector3;
  public direction: THREE.Vector3;
  public velocity: THREE.Vector3;
  private maxSteeringForce: number;
  public maxSpeed: number;
  public acceleration: number;
  public radius: number; // used for collision detection
  private wanderAngle: number;
  public hashPosition: [number, number]; // cur index of hash grid
  public index: number;
  private bounds: { width: number; height: number; depth: number };
  private hashGrid: SpatialGrid<Boid>;
  public boundRadius: number;

  constructor({
    speedMin,
    speedMax,
    speed,
    maxSteeringForce,
    acceleration,
    index,
    bounds,
    hashGrid,
  }: BoidParams) {
    // Initialize boid, give it a random initial position and direction
    this.index = index;
    this.group = new THREE.Group();
    this.bounds = bounds;
    this.position = new THREE.Vector3(
      rand(-this.bounds.width / 2, this.bounds.width / 2),
      rand(-this.bounds.height / 4, this.bounds.height / 4),
      rand(-this.bounds.depth / 2, this.bounds.depth / 2),
    );

    this.group.position.set(this.position.x, this.position.y, this.position.z);

    this.direction = new THREE.Vector3(
      rand(-1, 1),
      rand(-0.5, 0.5),
      rand(-1, 1),
    );
    this.velocity = this.direction.clone();

    // Calculate the boid's speed and scale based on the provided parameters
    const speedMultiplier = rand(speedMin, speedMax);
    this.maxSteeringForce = maxSteeringForce * speedMultiplier;
    this.maxSpeed = speed * speedMultiplier;
    this.acceleration = acceleration * speedMultiplier;
    this.wanderAngle = 0;

    // Scale down based on speed multiplier
    const scale = 1.0 / speedMultiplier;
    const radiusMultiplier = 15;
    this.radius = radiusMultiplier * scale;
    this.group.scale.setScalar(scale);
    this.group.updateMatrix();

    // Set hash position
    this.hashGrid = hashGrid;
    this.hashPosition = this.hashGrid.updateEntityPosition(
      this.group.uuid,
      this,
    );

    // Set boundary radius
    this.boundRadius = new THREE.Vector3(0, 0, 0).distanceTo(
      new THREE.Vector3().addScalar(
        Math.max(this.bounds.width, this.bounds.height, this.bounds.depth) / 2,
      ),
    );
  }

  // Applies steering behavior and updates direction/velocity
  step(timeMs: number) {
    const localEntities = this.hashGrid.getLocalEntities(
      this.position,
      this.radius,
    );
    this.applySteering(localEntities);

    const frameVelocity = this.velocity.clone();
    frameVelocity.multiplyScalar(timeMs / 1000);
    this.group.position.add(frameVelocity);
    this.position = this.group.position;

    const direction = this.direction;
    const m = new THREE.Matrix4();
    m.lookAt(new THREE.Vector3(0, 0, 0), direction, new THREE.Vector3(0, 1, 0));
    this.group.quaternion.setFromRotationMatrix(m);

    // Update hash grid
    this.hashPosition = this.hashGrid.updateEntityPosition(
      this.group.uuid,
      this,
      this.hashPosition,
    );

    // Update instance
    this.group.rotateY(Math.PI);
    this.group.updateMatrix();
  }

  // Apply steering behaviors
  applySteering(
    localEntities: Boid[],
    steeringForce = new THREE.Vector3(0, 0, 0),
  ) {
    const forces = [
      this.applyAlignment(localEntities),
      this.applySeparation(localEntities),
      this.applyCohesion(localEntities),
      this.avoidWalls(true), // smoothly avoid this.bounds
    ];

    for (const f of forces) {
      steeringForce.add(f);
    }

    // Limit force & velocity
    if (steeringForce.length() > this.maxSteeringForce) {
      steeringForce.normalize();
      steeringForce.multiplyScalar(this.maxSteeringForce);
    }

    this.velocity.add(steeringForce);

    if (this.velocity.length() > this.maxSpeed) {
      this.velocity.normalize();
      this.velocity.multiplyScalar(this.maxSpeed);
    }

    // Update direction
    this.direction = this.velocity.clone();
    this.direction.normalize();
  }

  // Calculates desired separation, steer it away if it gets too close
  applySeparation(localEntities: Boid[]) {
    const force = new THREE.Vector3(0, 0, 0);
    if (!localEntities.length) return force;

    for (const entity of localEntities) {
      const distanceToEntity = Math.max(
        0.001,
        entity.position.distanceTo(this.position) -
          1.5 * (this.radius + entity.radius),
      );

      const multiplier =
        (BOID_FORCE_SEPARATION / distanceToEntity) *
        (this.radius + entity.radius);
      const directionFromEntity = new THREE.Vector3().subVectors(
        this.position,
        entity.position,
      );
      directionFromEntity.normalize();
      force.add(directionFromEntity.multiplyScalar(multiplier));
    }

    return force;
  }

  // Calculates average heading of neighbors and steer towards it
  applyAlignment(localEntities: Boid[]) {
    const force = new THREE.Vector3(0, 0, 0);

    for (let entity of localEntities) {
      force.add(entity.direction);
    }

    force.normalize();
    force.multiplyScalar(BOID_FORCE_ALIGNMENT);
    return force;
  }

  // Calculates distance to this.bounds and avoids them
  avoidWalls(smooth = false, wallSeparationForce = 20) {
    const position = this.group.position.clone();
    const force = new THREE.Vector3(0, 0, 0);

    // Calculate the distance to nearest wall
    const xDistance = this.bounds.width / 2 - Math.abs(position.x);
    const yDistance = this.bounds.height / 2 - Math.abs(position.y);
    const zDistance = this.bounds.depth / 2 - Math.abs(position.z);

    const minDist = 0.5 + this.radius;

    let multiplier = 0;
    let sign = 1;
    let wall: THREE.Vector3;
    let directionFromWall = new THREE.Vector3();

    const calculateMultiplier = (distance: number) =>
      wallSeparationForce * distance;

    // Avoid width this.bounds
    if (xDistance <= minDist) {
      multiplier = calculateMultiplier(xDistance);
      sign = position.x >= 0 ? 1 : -1;
      wall = new THREE.Vector3(
        (sign * this.bounds.width) / 2,
        position.y,
        position.z,
      );
      directionFromWall = new THREE.Vector3().subVectors(position, wall);
    }

    // Avoid height this.bounds
    if (yDistance <= minDist) {
      multiplier = calculateMultiplier(yDistance);
      sign = position.y >= 0 ? 1 : -1;
      wall = new THREE.Vector3(
        position.x,
        (sign * this.bounds.height) / 2,
        position.z,
      );
      directionFromWall = new THREE.Vector3().subVectors(position, wall);
    }

    // Avoid depth this.bounds
    if (zDistance <= minDist) {
      multiplier = calculateMultiplier(zDistance);
      sign = position.z >= 0 ? 1 : -1;
      wall = new THREE.Vector3(
        position.x,
        position.y,
        (sign * this.bounds.depth) / 2,
      );
      directionFromWall = new THREE.Vector3().subVectors(position, wall);
    }

    directionFromWall.normalize();
    force.add(directionFromWall.multiplyScalar(multiplier));

    // bonk against bound
    if (!smooth && directionFromWall.length() > 0) {
      this.velocity.add(directionFromWall);
    }
    return force;
  }

  // Calculates average position of neighbors and steer towards it
  applyCohesion(localEntities: Boid[]) {
    const force = new THREE.Vector3(0, 0, 0);
    if (!localEntities.length) return force;

    const averagePosition = new THREE.Vector3(0, 0, 0);
    for (const entity of localEntities) {
      averagePosition.add(entity.position);
    }
    averagePosition.multiplyScalar(1 / localEntities.length);

    const directionToTarget = averagePosition.clone().sub(this.position);
    directionToTarget.normalize();
    directionToTarget.multiplyScalar(BOID_FORCE_COHESION);

    return directionToTarget;
  }

  applySeek(
    target: THREE.Vector3,
    intensity = 1,
    seekMinRadius = this.boundRadius / 8,
    seekMaxRadius = this.boundRadius / 3,
  ) {
    const distance = Math.max(
      0,
      (this.position.distanceTo(target) - seekMinRadius) / this.boundRadius,
    );

    // Limit range of seek
    if (distance >= seekMaxRadius / this.boundRadius)
      return new THREE.Vector3(0, 0, 0);

    const direction = target.clone().sub(this.position).normalize();
    const force = direction.multiplyScalar(
      BOID_FORCE_SEEK * (intensity / (distance + this.radius + 0.1)),
    );

    return force;
  }

  // TODO
  applyWander() {}

  // TODO
  applyAvoidance() {}

  debug() {
    const wireframe = new THREE.WireframeGeometry(
      new THREE.SphereGeometry(this.radius),
    );

    const helper = new THREE.LineSegments(wireframe);
    (helper.material as THREE.Material).depthTest = false;
    (helper.material as THREE.Material).opacity = 0.25;
    (helper.material as THREE.Material).transparent = true;

    this.group.add(helper);
  }
}

export default Boid;
