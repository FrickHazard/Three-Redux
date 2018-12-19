import { DataStore, Observable } from './observer';
import { createSubscribeAndSignalChangeFunctions } from './subscriptionFactory';

export function createDataStore <T>(dataStore: DataStore<T>): Observable<[T]> {
  const { signalChange, subscribe } = createSubscribeAndSignalChangeFunctions<[T]>();
  function callback() {
    signalChange(dataStore.getState());
  }
   // @TODO clean up for this?
  const unsubscribe = dataStore.subscribe(callback);
  return {
    subscribe,
  };
};
