import { DataStore } from '../snaffle-bit'
import { Point3D } from '../utils/basicDataTypes';

interface PlayerData {
  readonly pitch: number;
  readonly yaw: number;
  readonly position: Point3D;
}

type PlayerDataState = Readonly<PlayerData>;

export const createStore = (): DataStore<PlayerDataState, PlayerDataState> => {
  let state: PlayerDataState = {
    pitch: 0,
    yaw: 0,
    position: {
      x: 0,
      y: 0,
      z: 14,
    }
  }

  let currentListeners: (() => void)[] = [];
  let nextListeners = currentListeners;

  function subscribe(listener: () => void) {

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }
  
  return {
    dispatch: function(action: PlayerDataState) {
     state = action
     return action;
    },
    getState: () => state,
    subscribe,
  };
};
