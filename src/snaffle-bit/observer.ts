export type Unsubscribe = () => void;

export type Subscribe<T extends any[]> = (listenerCallback: (...params: T) => void) => Unsubscribe;

export interface Observable<T extends any[]> {
  subscribe: Subscribe<T>;
}

export interface DataStore<State extends Readonly<{}>> extends Observable<never> {
  // data stores only expose a low level change with no params
  subscribe: Subscribe<never>;
  getState: () => State;
}

export interface Event<T extends any[]> extends Observable<T> {
  subscribe: Subscribe<T>;
  notify: () => void;
}
