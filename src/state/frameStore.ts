import { DataStore } from '../snaffle-bit'
import { createDataStoreSubscribeFunction } from '../snaffle-bit/createDataStore';
import { Point3D } from '../utils/basicDataTypes';
import { Point2D } from '../utils/basicDataTypes';

type FrameData = Readonly<{
  // time since last frame
  deltaTime: number;
  // computed input deltas for this frame
  playerMovementInputAxisDelta: Point2D;
  playerLookInputAxisDelta: Point2D;
}>

interface FrameDataStore extends DataStore<FrameData> {
};

export const createInputDataStore = (): FrameDataStore => {
  const state: FrameData = {
    deltaTime: 0,
    playerLookInputAxisDelta: {x: 0, y: 0 },
    playerMovementInputAxisDelta: { x:0, y:0 },
  };

  const { subscribe, signalChange } = createDataStoreSubscribeFunction();

  function computeNewFrameData(){
    
  }

  return {
    getState: () => state,
    subscribe,
  };
};
