import { frameDataStore } from '../index';
import { processPlayerInput } from './library/processInput';

let timeElapsed = 0.0;
const simulationStep = 0.2;
let currentTime = performance.now() / 1000;
let accumulator = 0.0;

// let frameTimeCap = 0.25;

export function simulateFrame() {
  const nextTime = performance.now() / 1000;
  let lastFrameTime = nextTime - currentTime;
  // uncomment to prevent worse case scenario at cost of determinism  
  // if (frameTime > frameTimeCap) frameTime = frameTimeCap;
  currentTime = nextTime;

  accumulator += lastFrameTime;

  while (accumulator >= simulationStep)
  {
      // previousState = currentState;
      simulate(timeElapsed, simulationStep);
      timeElapsed += simulationStep;
      accumulator -= simulationStep;
  }

  const alpha = accumulator / simulationStep;
  // state = currentState * alpha + previousState * ( 1.0 - alpha );

  frameDataStore.computeFrameData(lastFrameTime);
  processPlayerInput();
};

function simulate(timeElapsed: number, simulationStep: number) {}