import { DataStore } from '../snaffle-bit'
import { createDataStoreSubscribeFunction } from '../snaffle-bit/createDataStore';
import { Point2D } from '../utils/basicDataTypes';

type PlayerInputBuffer = Readonly<{
  playerMovementInput: Point2D[];
  playerLookInput: Point2D[];
}>

type FrameData = Readonly<{
  // time since last frame
  deltaTime: number;
  // computed input deltas for this frame
  playerMovementInputAxisDelta: Point2D;
  playerLookInputAxisDelta: Point2D;
  inputBuffer: PlayerInputBuffer;
}>

interface FrameDataStore extends DataStore<FrameData> {
  computeFrameData: (deltaTime: number) => void,
  addPlayerMovementInput: (inputAmount: Point2D) => void,
  addPlayerLookInput: (inputAmount: Point2D) => void,
};

export const createFrameDataStore = (): FrameDataStore => {
  let state: FrameData = {
    deltaTime: 0,
    playerLookInputAxisDelta: { x: 0, y: 0 },
    playerMovementInputAxisDelta: { x:0, y: 0 },
    inputBuffer: {
      playerLookInput: [],
      playerMovementInput: [],
    },
  };

  const { subscribe, signalChange } = createDataStoreSubscribeFunction();

  function sum(array: Point2D[]) {
    return array.reduce(
      (accumulator, currentValue) => ({
        x: accumulator.x + currentValue.x,
        y: accumulator.y + currentValue.y
      }), { x: 0, y: 0 });
  }

  return {
    computeFrameData: function(deltaTime: number) {
      state = {
        ...state,
        deltaTime: deltaTime,
        playerLookInputAxisDelta: sum(state.inputBuffer.playerLookInput),
        playerMovementInputAxisDelta: sum(state.inputBuffer.playerMovementInput),
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
    addPlayerMovementInput: function(inputAmount: Point2D){
      state.inputBuffer.playerMovementInput.push(inputAmount);
      signalChange();
    },
    getState: () => state,
    subscribe,
  };
};
