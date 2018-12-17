import { Point3D } from './library/basicDataTypes';

let timeElapsed = 0.0;
let simulationStep = 0.2;
let currentTime = performance.now() / 1000;
let accumulator = 0.0;

// let frameTimeCap = 0.25;

export function simulateFrame() {
  const nextTime = performance.now() /1000;
  let frameTime = nextTime - currentTime;
  // uncomment to prevent worse case scenario at cost of determinism  
  // if (frameTime > frameTimeCap) frameTime = frameTimeCap;
  currentTime = nextTime;

  accumulator += frameTime;

  while (accumulator >= simulationStep)
  {
      // previousState = currentState;
      simulate(timeElapsed, simulationStep);
      timeElapsed += simulationStep;
      accumulator -= simulationStep;
  }

  const alpha = accumulator / simulationStep;
  // state = currentState * alpha + previousState * ( 1.0 - alpha );

  // render(state);
};

interface PhysicsInfo {
  mass: number;
  velocity: Point3D;
  position: Point3D;
}

function simulate(timeElapsed: number, simulationStep: number){

}

const gravityValue = 9.81; // m / s^2
const downVector = [0, -1];

type Newton = number;

function getGravitationalForce(obj: PhysicsInfo): Newton {
  return gravityValue * obj.mass;
}

function spring(state: PhysicsInfo, timeElapsed: number, simulationStep: number): PhysicsInfo {
  var f = (200 - state.position.x) * 3;
  var newVelocityX = state.velocity.x + f * simulationStep;
  var newPositionX = state.position.x + newVelocityX * simulationStep;
  return {
    mass: state.mass,
    position: { ...state.position, x: newPositionX },
    velocity: { ...state.velocity, x: newVelocityX }
  };
}