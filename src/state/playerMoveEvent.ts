import { createSubscribeAndSignalChangeFunctions } from '../snaffle-bit/subscriptionFactory';
import { FrameDataStore  } from './frameDataStore';
import { Point3D, Point2D } from '../library/basicDataTypes';
import { InputDataStore } from './inputStore';

const moveSpeedPerSecond = 0.003;
const lookSpeedPerSecond = 0.001;

export const createPlayerMoveEvent = (
  frameDataStore: FrameDataStore,
  inputDataStore: InputDataStore
) => {
  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions<[{
    movementAxisInput: Point3D,
    lookAxisInput: Point2D,
  }]>();
  
  return {
    notify: function(){
      const frameData = frameDataStore.getState();
      const frameDeltaTime = frameData.deltaTime === 0 ? 0.000001 : frameData.deltaTime;
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
      signalChange({ 
        movementAxisInput: {
          x: ((moveLeftValue + moveRightValue) / frameDeltaTime) * moveSpeedPerSecond,
          y: ((moveUpValue + moveDownValue) / frameDeltaTime) * moveSpeedPerSecond,
          z: ((moveBackValue + moveForwardValue) / frameDeltaTime) * moveSpeedPerSecond,
        },
        lookAxisInput: {
          x: ((lookLeftValue + lookRightValue) / frameDeltaTime) * lookSpeedPerSecond, 
          y: ((lookUpValue + lookDownValue) / frameDeltaTime) * lookSpeedPerSecond,
        },
      });
    },
    subscribe,
  }
}
