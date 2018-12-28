import { DataStore } from '../../snaffle-bit'
import { createSubscribeAndSignalChangeFunctions } from '../../snaffle-bit/subscriptionFactory';
import { Point3D } from '../../library/basicDataTypes';
import { TransformMatrix } from '../../library/transformMatrix';

export type PlayerTransformData = Readonly<{
  pitch: number;
  yaw: number;
  bodyTransformMatrix: TransformMatrix;
  headTransformMatrix: TransformMatrix;
}>

export interface PlayerTransformDataStore extends DataStore<PlayerTransformData> {
  setState(data: PlayerTransformData): void;
};

export const createPlayerTransformDataStore = (): PlayerTransformDataStore => {
  let state: PlayerTransformData = {
    pitch: 0,
    yaw: 0,
    headTransformMatrix: [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ],
    bodyTransformMatrix: [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ],
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
