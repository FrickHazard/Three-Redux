import shallowEqual from './shallowEqual';

const emptyFunction = function(){}

type ExtensionsType = {};

export type Unsubscribe = () => void;

export type Subscribe<T extends any[]> = (listenerCallback: (...input: T) => void) => Unsubscribe;

type DataStoreSubscribe = Subscribe<any[]>;

export interface Observable {
  subscribe: Subscribe<any>;
}

// more or less copied from redux
export interface DataStore<State extends Readonly<{}>> extends Observable {
  subscribe: DataStoreSubscribe;
  getState: () => State;
}

interface MapStateToCallback<SelectorResult, State> {
  selector: ((state: State) => SelectorResult);
  callback: ((input: SelectorResult) => void);
}

interface MemoizedMapStateToCallbackData<SelectorResult, State> extends MapStateToCallback<SelectorResult, State>{
  previousResult: SelectorResult;
};

export interface SnaffleBit <State, Extensions extends ExtensionsType>{
  readonly createChild: (
    mapStateToCallbacks: MapStateToCallback<any, State>[],
  ) => SnaffleBit<State, Extensions>;
  readonly dispose: () => void;
}

function memoizeAndInitialCallMapStateToCallbacks<State, SelectorResult>(
  store: DataStore<State>,
  mapStateToCallbackData: MapStateToCallback<SelectorResult, State>[]
): MemoizedMapStateToCallbackData<SelectorResult, State>[] {
  const state = store.getState();
    return mapStateToCallbackData.map(mapStateToCallback => {
      const selectorResult = mapStateToCallback.selector(state);
      // initial callback
      mapStateToCallback.callback(selectorResult);
      return {
        selector: mapStateToCallback.selector,
        callback: mapStateToCallback.callback,
        previousResult: selectorResult,
      };
    });
  }

function createHandleChangeFunctionFromMapStateToCallback<SelectorResult, State>(
  store: DataStore<State>,
  mapStateToCallbackData: MemoizedMapStateToCallbackData<SelectorResult, State>[]) {
  if (mapStateToCallbackData.length === 0) return  emptyFunction;
  return function() {
    for (const mapStateData of mapStateToCallbackData) {
      const selectorResult = mapStateData.selector(store.getState());
      if (!shallowEqual(mapStateData.previousResult, selectorResult)) {
        mapStateData.callback(selectorResult);
        mapStateData.previousResult = selectorResult;
      }
    }
  }
};

function createSnaffleBit <State, Extensions extends ExtensionsType>(
  store: DataStore<State>, 
  mapStateToCallbacks: MapStateToCallback<any, State>[],
  extensions: Extensions,
) {

  const children: SnaffleBit<State, Extensions>[] = [];

  const handleChange =
    createHandleChangeFunctionFromMapStateToCallback(store,
      memoizeAndInitialCallMapStateToCallbacks(store, mapStateToCallbacks));

  var unsubscribe = store.subscribe(handleChange);

  return Object.assign(Object.assign({}, extensions), {
    createChild: function(
      mapStateToCallbacks: MapStateToCallback<any, State>[],
    ) {
      const newSnaffle = createSnaffleBit(store, mapStateToCallbacks, extensions);
      children.push(newSnaffle);
      return newSnaffle;
    },
    dispose: function() {
      for (let i = 0; i < children.length; i ++) {
        children[i].dispose();
      }
      unsubscribe();
    }
  });
}

export const createSnaffleBitProvider = <State, Extensions extends ExtensionsType>(
  dataStore: DataStore<State>,
  extensions: Extensions,
) => {
  return {
    createRoot: (
      mapStateToCallbacks: MapStateToCallback<any, State>[] = [],
    ) => createSnaffleBit(dataStore, mapStateToCallbacks, extensions)
  };
};
