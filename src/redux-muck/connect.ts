import { SubscriptionHandler } from './subscriptionHandler';
import { Subscription } from './subscription';
import { Store } from 'redux';

let getStore: (() => Store) = () => { throw new Error('redux muck was not intialized!'); };

export const intializeReduxMuck = (store: Store) => {
  getStore = () => store;
};

interface StoreMapper <T>{
  selectorComparer: ((selectorResult: T) => boolean);
  selector: ((state: any) => T);
  callback: ((input: T) => void);
};

export const createStoreSubscriptions = (...storeMaps: StoreMapper<any>[]) => {
  for (const storeMap of storeMaps) {

  }
  return function(instance: Wrapper) {
    
  }
};

function mergeStoreHandlersIntoOnStateChangeFunction(...storeMaps: StoreMapper<any>[]) {
  return function() {
    for (const storeMap of storeMaps) {
      if(storeMap.selector()
    }
  }
};
