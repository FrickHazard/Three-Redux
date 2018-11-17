import { DataStore } from '../snaffle-bit'
import { createDataStoreSubscribeFunction } from '../snaffle-bit/createDataStore';
import { Point3D } from '../utils/basicDataTypes';

type PlayerData = Readonly<{
  readonly pitch: number;
  readonly yaw: number;
  readonly position: Point3D;
}>

interface PlayerDataStore extends DataStore<PlayerData> {
  set: (newState: PlayerData) => void;
};

export const createPlayerDataStore = (): PlayerDataStore => {
  let state: PlayerData = {
    pitch: 0,
    yaw: 0,
    position: {
      x: 0,
      y: 0,
      z: 14,
    }
  }

  const { subscribe, signalChange } = createDataStoreSubscribeFunction();
  
  return {
    set: function(newState: PlayerData) {
      state = newState;
      signalChange();
    },
    getState: () => state,
    subscribe,
  };
};
