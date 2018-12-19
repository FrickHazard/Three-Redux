import { DataStore } from '../../snaffle-bit'
import { createSubscribeAndSignalChangeFunctions } from '../../snaffle-bit/subscriptionFactory';
import { Point3D } from '../../library/basicDataTypes';

export type PlayerTransformData = Readonly<{
  pitch: number;
  yaw: number;
  position: Point3D;
}>

export interface PlayerTransformDataStore extends DataStore<PlayerTransformData> {
  setState(data: PlayerTransformData): void;
};

export const createPlayerTransformDataStore = (): PlayerTransformDataStore => {
  let state: PlayerTransformData = {
    pitch: 0,
    yaw: 0,
    position: {
      x: 0,
      y: 0,
      z: 0
    },
  };

  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions();

  return {
    setState: function(data) {
      state = data;
      signalChange();
    },
    getState: () => state,
    subscribe,
  };
};
