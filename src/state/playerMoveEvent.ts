import { createSubscribeAndSignalChangeFunctions } from '../snaffle-bit/subscriptionFactory';
import { createFrameDataStore, FrameDataStore  } from './frameDataStore';
import { Point3D, Point2D } from '../library/basicDataTypes';

export const createPlayerMoveEvent = (frameDataStore: FrameDataStore) => {
  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions();
  
  return {
    signalChange,
    subscribe,
  }
}
