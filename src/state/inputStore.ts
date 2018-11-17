import { DataStore } from '../snaffle-bit'
import { createDataStoreSubscribeFunction } from '../snaffle-bit/createDataStore';
import { Point3D } from '../utils/basicDataTypes';
import { Point2D } from '../utils/basicDataTypes';

type Input = Readonly<{
  keyCodes: number[];
  mouseMove: number[];
}>

interface InputDataStore extends DataStore<Input> {
};

export const createInputDataStore = (): InputDataStore => {
  const state: Input = {

  };

  const { subscribe, signalChange } = createDataStoreSubscribeFunction();

  function computeNewFrameData(){
    
  }

  return {
    k
    getState: () => state,
    subscribe,
  };
};
