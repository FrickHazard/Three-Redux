import { DataStore } from '../snaffle-bit'
import { createSubscribeAndSignalChangeFunctions } from '../snaffle-bit/subscriptionFactory';
import { Point2D, Point3D } from '../library/basicDataTypes';

type PlayerInputBuffer = Readonly<{
  playerMovementInput: Point3D[];
  playerLookInput: Point2D[];
}>

type FrameData = Readonly<{
  // time since last frame
  deltaTime: number;
  // computed input deltas for this frame
  playerMovementInputAxisDelta: Point3D;
  playerLookInputAxisDelta: Point2D;
  inputBuffer: PlayerInputBuffer;
}>

export interface FrameDataStore extends DataStore<FrameData> {
  computeFrameData: (deltaTime: number) => void,
  addPlayerMovementInput: (inputAmount: Point3D) => void,
  addPlayerLookInput: (inputAmount: Point2D) => void,
};

export const createFrameDataStore = (): FrameDataStore => {
  let state: FrameData = {
    deltaTime: 0,
    playerLookInputAxisDelta: { x: 0, y: 0 },
    playerMovementInputAxisDelta: { x: 0, y: 0, z: 0 },
    inputBuffer: {
      playerLookInput: [],
      playerMovementInput: [],
    },
  };

  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions();

  function sum2D(array: Point2D[]) {
    return array.reduce(
      (accumulator, currentValue) => ({
        x: accumulator.x + currentValue.x,
        y: accumulator.y + currentValue.y
      }), { x: 0, y: 0 });
  }

  function sum3D(array: Point3D[]) {
    return array.reduce(
      (accumulator, currentValue) => ({
        x: accumulator.x + currentValue.x,
        y: accumulator.y + currentValue.y,
        z: accumulator.z + currentValue.z,
      }), { x: 0, y: 0, z:0 });
  }

  return {
    computeFrameData: function(deltaTime: number) {
      state = {
        ...state,
        deltaTime: deltaTime,
        playerLookInputAxisDelta: sum2D(state.inputBuffer.playerLookInput),
        playerMovementInputAxisDelta: sum3D(state.inputBuffer.playerMovementInput),
        inputBuffer: {
          playerLookInput: [],
          playerMovementInput: [],
        }
      };
      signalChange();
    },
    addPlayerLookInput: function(inputAmount: Point2D) {
      state.inputBuffer.playerLookInput.push(inputAmount);
      signalChange();
    },
    addPlayerMovementInput: function(inputAmount: Point3D){
      state.inputBuffer.playerMovementInput.push(inputAmount);
      signalChange();
    },
    getState: () => state,
    subscribe,
  };
};
