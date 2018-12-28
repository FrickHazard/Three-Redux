import { inputDataStore, frameDataStore, reduxDataStore, playerTransformDataStore } from '../../index';
import {
  createYAxisRotationMatrix, createZAxisRotationMatrix, multiplyMatrices,
  multiplyMatrixByScalar, createXAxisRotationMatrix, extractPosition,
  transformMatrixFromRotationAndPosition,
  Vec3
} from '../library/transformMatrix';

function calculatePlayerTransformChange(
  playerMoveSpeedPerSecond: number,
  playerLookSpeedPerSecond: number
) {
  const frameData = frameDataStore.getState();
  const frameDeltaTime = frameData.lastFrameTime;
  const inputData = inputDataStore.getState();
  const moveUpValue = inputData.playerMovementInput.up ? -1 : 0;
  const moveDownValue = inputData.playerMovementInput.down ? 1 : 0;
  const moveLeftValue = inputData.playerMovementInput.left ? 1 : 0;
  const moveRightValue = inputData.playerMovementInput.right ? -1 : 0;
  const moveForwardValue = inputData.playerMovementInput.forward ? 1 : 0;
  const moveBackValue = inputData.playerMovementInput.back ? -1 : 0;
  const lookUpValue = inputData.playerLookInput.up ? -1 : 0;
  const lookDownValue = inputData.playerLookInput.down ? 1 : 0;
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

  if (
    axis.lookAxisInput.x == 0 &&
    axis.lookAxisInput.y == 0 &&
    axis.movementAxisInput.x == 0 &&
    axis.movementAxisInput.y == 0 &&
    axis.movementAxisInput.z == 0
  ) {
    return;
  }

  const previousPlayerTransform = playerTransformDataStore.getState();

  const newPitch = previousPlayerTransform.pitch + axis.lookAxisInput.y;
  const newYaw = previousPlayerTransform.yaw + axis.lookAxisInput.x;

  const right   = [1, 0, 0];
  const up      = [0, 1, 0];
  const forward = [0, 0, 1];
  
  const xAxisRotation = createXAxisRotationMatrix(newPitch);
  const yAxisRotation = createYAxisRotationMatrix(newYaw);
  // const zAxisRotation = createZAxisRotationMatrix(0);

  const localRightDelta = multiplyMatrixByScalar(multiplyMatrices(yAxisRotation, right, 3, 3, 3, 1), axis.movementAxisInput.x);
  const localUpDelta = multiplyMatrixByScalar(multiplyMatrices(yAxisRotation, up, 3, 3, 3, 1), axis.movementAxisInput.y);
  const localForwardDelta = multiplyMatrixByScalar(multiplyMatrices(yAxisRotation, forward, 3, 3, 3, 1), axis.movementAxisInput.z);

  const previousPosition = extractPosition(previousPlayerTransform.bodyTransformMatrix);

  const position: Vec3 = [
    previousPosition[0] + localRightDelta[0] + localUpDelta[0] + localForwardDelta[0],
    previousPosition[1] + localRightDelta[1] + localUpDelta[1] + localForwardDelta[1],
    previousPosition[2] + localRightDelta[2] + localUpDelta[2] + localForwardDelta[2],
  ];

  const nextPlayerTransform = {
    ...previousPlayerTransform,
    pitch: previousPlayerTransform.pitch + axis.lookAxisInput.y,
    yaw: previousPlayerTransform.yaw + axis.lookAxisInput.x,
    bodyTransformMatrix: transformMatrixFromRotationAndPosition(yAxisRotation, position),
    headTransformMatrix: transformMatrixFromRotationAndPosition(xAxisRotation, position),
  };

  playerTransformDataStore.setState(nextPlayerTransform);
}
