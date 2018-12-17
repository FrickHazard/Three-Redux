
const gravityValue = 9.81; // m / s^2
const downVector = [0, -1];

type Newton = number;

interface PhysicsInfo {
  mass: number;
  velocity: number;
}

export function getGravitationalForce(obj: PhysicsInfo): Newton {
  return gravityValue * obj.mass;
}