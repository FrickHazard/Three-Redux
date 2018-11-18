import shallowEqual from './shallowEqual';

type Unsubscribe = () => void;

type Dispatch <Action> = (action: Action) => Action;

// more or less copied from redux
export interface DataStore<State extends Readonly<{}>> {
  getState: () => State;
  subscribe: (listener: () => void) => Unsubscribe;
}

interface MapDispatchToActionDictionary {
  readonly [key: string]: (() => any);
}

interface MapStateToCallback<SR, ST> {
  selector: ((state: ST) => SR);
  callback: ((input: SR) => void);
}

interface MemoizedMapStateToCallbackData<SR, ST> extends MapStateToCallback<SR, ST>{
  previousResult: SR;
};

export interface SnaffleBit <ST, EX extends {}>{
  readonly createChild: (
    mapStateToCallbacks: MapStateToCallback<any, ST>[],
  ) => SnaffleBit<ST, EX> & EX;
  readonly dispose: () => void;
}

function memoizeAndInitialCallMapStateToCallbacks<ST,SR>(
  store: DataStore<ST>,
  mapStateToCallbackData: MapStateToCallback<SR, ST>[]
): MemoizedMapStateToCallbackData<SR, ST>[] {
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

function createHandleChangeFunctionFromMapStateToCallback<SR, ST>(
  store: DataStore<ST>,
  mapStateToCallbackData: MemoizedMapStateToCallbackData<SR, ST>[]) {
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

function createSnaffleBit <ST, EX extends object>(
  store: DataStore<ST>, 
  mapStateToCallbacks: MapStateToCallback<any, ST>[],
  extensions: EX,
) {

  const children: SnaffleBit<ST, EX>[] = [];

  const handleChange =
    createHandleChangeFunctionFromMapStateToCallback(store,
      memoizeAndInitialCallMapStateToCallbacks(store, mapStateToCallbacks));

  var unsubscribe = store.subscribe(handleChange);

  return Object.assign(Object.assign({}, extensions), {
    createChild: function(
      mapStateToCallbacks: MapStateToCallback<any, ST>[],
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

export const createSnaffleBitProvider = <ST, EX extends {}>(
  dataStore: DataStore<ST>,
  extensions: EX,
) => {
  return {
    createRoot: (
      mapStateToCallbacks: MapStateToCallback<any, ST>[],
    ) => createSnaffleBit(dataStore, mapStateToCallbacks, extensions)
  };
};
