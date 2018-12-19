import { Point3D } from './basicDataTypes';

export interface RigidbodyData {
  mass: number;
  velocity: Point3D;
  position: Point3D;
}

export function spring(state: RigidbodyData, timeElapsed: number, simulationStep: number): RigidbodyData {
  var f = (200 - state.position.x) * 3;
  var newVelocityX = state.velocity.x + f * simulationStep;
  var newPositionX = state.position.x + newVelocityX * simulationStep;
  return {
    mass: state.mass,
    position: { ...state.position, x: newPositionX },
    velocity: { ...state.velocity, x: newVelocityX }
  };
}