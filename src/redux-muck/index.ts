import { Store } from 'redux'; 

export const initializeReduxMuck = <T>(store: Store<T>) => {
  let currentState = store.getState();
  store.subscribe(() => {
  
  });
};