import { DataStore } from '../snaffle-bit'
import { createSubscribeAndSignalChangeFunctions } from '../snaffle-bit/subscriptionFactory';

type FrameData = Readonly<{
  deltaTime: number;
}>

export interface FrameDataStore extends DataStore<FrameData> {
  computeFrameData: (deltaTime: number) => void;
};

export const createFrameDataStore = (): FrameDataStore => {
  let state: FrameData = {
    deltaTime: 0,
  };

  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions();

  return {
    computeFrameData: function(deltaTime: number) {
      state = {
        deltaTime
      };
      signalChange();
    },
    getState: () => state,
    subscribe,
  };
};
