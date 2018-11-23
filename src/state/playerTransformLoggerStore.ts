import { DataStore } from '../snaffle-bit'
import { createSubscribeAndSignalChangeFunctions } from '../snaffle-bit/subscriptionFactory';
import { Point3D, Point2D } from '../library/basicDataTypes';

export type PlayerTransformData = Readonly<{
  readonly pitch: number;
  readonly yaw: number;
  readonly position: Point3D;
}>


interface PlayerTransformLoggerDataStore extends DataStore<PlayerTransformData[]> {
  logPlayerTransform: (newState: PlayerTransformData) => void;
};

export const createPlayerTransformLogDataStore = (): PlayerTransformLoggerDataStore => {
  let state: PlayerTransformData[] = [];

  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions();
  
  return {
    logPlayerTransform: function(playerTransformData: PlayerTransformData) {
      state = [playerTransformData];
      signalChange();
    },
    getState: () => state,
    subscribe,
  };
};
