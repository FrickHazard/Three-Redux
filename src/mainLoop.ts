const timeSinceLastSimulationFrame = 0;
const physicsTimeStep = 1;
const maxFrameTime = 0.25;  

let lastFrame = performance.now();

function main() {
  const now = performance.now();
  const frameTime = now - lastFrame;
  lastFrame = now;
};

