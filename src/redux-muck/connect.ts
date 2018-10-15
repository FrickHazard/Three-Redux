import { Wrapper } from './Wrapper';
import { Subscription } from './Subscription';

interface StoreMapper <T>{
  parent?: StoreMapper<any>;
  selector: ((state: any) => T);
  callback: ((input: T) => void);
};

export const connect = (...storeMaps: StoreMapper<any>[]) => {
  for (const storeMap of storeMaps) {
    // const subscription = new Subscription();
  }
};
