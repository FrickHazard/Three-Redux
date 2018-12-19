import { inputDataStore, frameDataStore, reduxDataStore, playerTransformDataStore } from '../../index';

function calculatePlayerTransformChange(
  playerMoveSpeedPerSecond: number,
  playerLookSpeedPerSecond: number
) {
  const frameData = frameDataStore.getState();
  const frameDeltaTime = frameData.lastFrameTime;
  const inputData = inputDataStore.getState();
  const moveUpValue = inputData.playerMovementInput.up ? 1 : 0;
  const moveDownValue = inputData.playerMovementInput.down ? -1 : 0;
  const moveLeftValue = inputData.playerMovementInput.left ? -1 : 0;
  const moveRightValue = inputData.playerMovementInput.right ? 1 : 0;
  const moveForwardValue = inputData.playerMovementInput.forward ? 1 : 0;
  const moveBackValue = inputData.playerMovementInput.back ? -1 : 0;
  const lookUpValue = inputData.playerLookInput.up ? 1 : 0;
  const lookDownValue = inputData.playerLookInput.down ? -1 : 0;
  const lookLeftValue = inputData.playerLookInput.left ? -1 : 0;
  const lookRightValue = inputData.playerLookInput.right ? 1 : 0;
  return { 
      movementAxisInput: {
        x: ((moveLeftValue + moveRightValue) * frameDeltaTime) * playerMoveSpeedPerSecond,
        y: ((moveUpValue + moveDownValue) * frameDeltaTime) * playerMoveSpeedPerSecond,
        z: ((moveBackValue + moveForwardValue) * frameDeltaTime) * playerMoveSpeedPerSecond,
      },
      lookAxisInput: {
        x: ((lookLeftValue + lookRightValue) * frameDeltaTime) * playerLookSpeedPerSecond, 
        y: ((lookUpValue + lookDownValue) * frameDeltaTime) * playerLookSpeedPerSecond,
      },
  };
}

export function processPlayerInput() {
  const reduxState = reduxDataStore.getState();
  const axis = calculatePlayerTransformChange(reduxState.application.playerMoveSpeedPerSecond,
    reduxState.application.playerLookSpeedPerSecond);

  const previousPlayerTransform = playerTransformDataStore.getState();

  const nextPlayerTransform = {
    ...previousPlayerTransform,
    pitch: previousPlayerTransform.pitch + axis.lookAxisInput.y,
    yaw: previousPlayerTransform.yaw + axis.lookAxisInput.x,
    position: {
      x: previousPlayerTransform.position.x + axis.movementAxisInput.x,
      y: previousPlayerTransform.position.y + axis.movementAxisInput.y,
      z: previousPlayerTransform.position.z + axis.movementAxisInput.z
    }
  };

  playerTransformDataStore.setState(nextPlayerTransform);
}
