import { DataStore } from '../../snaffle-bit'
import { createSubscribeAndSignalChangeFunctions } from '../../snaffle-bit/subscriptionFactory';

type FrameData = Readonly<{
  lastFrameTime: number;
}>

export interface FrameDataStore extends DataStore<FrameData> {
  computeFrameData: (deltaTime: number) => void;
};

export const createFrameDataStore = (): FrameDataStore => {
  let state: FrameData = {
    lastFrameTime: 0,
  };

  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions();

  return {
    computeFrameData: function(lastFrameTime: number) {
      state = {
        lastFrameTime
      };
      signalChange();
    },
    getState: () => state,
    subscribe,
  };
};
