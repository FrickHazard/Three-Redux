import { DataStore } from './index';
import shallowEqual from './shallowEqual';

type ExtensionsType = {}

interface MapStateToCallback<SelectorResult, State> {
  selector: ((state: State) => SelectorResult);
  callback: ((input: SelectorResult) => void);
}

interface MemoizedMapStateToCallback<SelectorResult, State> extends MapStateToCallback<SelectorResult, State>{
  previousState: SelectorResult;
};

export interface SnaffleBit <State, Extensions extends ExtensionsType>{
  readonly createChild: (
    mapStateToCallbacks: MapStateToCallback<any, State>[]
  ) => SnaffleBit<State, Extensions>;
  readonly dispose: () => void;
}

const noop = function(){}

function memoizeAndInitialCallMapStateToCallbacks<State, SelectorResult>(
  store: DataStore<State>,
  mapStateToCallbackList: MapStateToCallback<SelectorResult, State>[]
): MemoizedMapStateToCallback<SelectorResult, State>[] {
  const state = store.getState();
    return mapStateToCallbackList.map(mapStateToCallback => {
      const selectorResult = mapStateToCallback.selector(state);
      // initial callback
      mapStateToCallback.callback(selectorResult);
      return {
        selector: mapStateToCallback.selector,
        callback: mapStateToCallback.callback,
        previousState: selectorResult,
      };
    });
  }

function createHandleChangeFunctionFromMapStateToCallback<SelectorResult, State>(
  store: DataStore<State>,
  mapStateToCallbackData: MemoizedMapStateToCallback<SelectorResult, State>[]
) {
  if (mapStateToCallbackData.length === 0) return  noop;
  return function() {
    for (const mapStateData of mapStateToCallbackData) {
      const selectorResult = mapStateData.selector(store.getState());
      if (!shallowEqual(mapStateData.previousState, selectorResult)) {
        mapStateData.callback(selectorResult);
        mapStateData.previousState = selectorResult;
      }
    }
  }
};

function createSnaffleBit <State, Extensions extends ExtensionsType>(
  store: DataStore<State>, 
  mapStateToCallbacks: MapStateToCallback<any, State>[],
  extensions: Extensions
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
  extensions: Extensions
) => {
  return {
    createRoot: (
      mapStateToCallbacks: MapStateToCallback<any, State>[] = [],
    ) => createSnaffleBit(dataStore, mapStateToCallbacks, extensions)
  };
};