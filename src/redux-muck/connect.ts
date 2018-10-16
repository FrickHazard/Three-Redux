import { Wrapper } from './Wrapper';
import { Subscription } from './Subscription';
import { Store } from 'redux';

let getStore:  (() => Store) = () => { throw new Error('Get State not intialized'); };

export const intializeReduxMuck = (store: Store) => {
  getStore = () => store;
};

interface StoreMapper <T>{
  selector: ((state: any) => T);
  callback: ((input: T) => void);
};

// const createSubscriptionFrom = (mapper: StoreMapper) => {
//   return new Subscription(getStore(), )
// }

export const connectStateChangeSubscriptions = (...storeMaps: StoreMapper<any>[]) => {
  for (const storeMap of storeMaps) {

  }
  return function(instance: Wrapper) {
    
  }
};
