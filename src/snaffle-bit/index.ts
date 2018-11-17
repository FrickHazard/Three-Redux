// import { Subscription } from './subscription';
import shallowEqual from './shallowEqual';

type Unsubscribe = () => void;

type Dispatch <Action> = (action: Action) => Action;

// more or less copied from redux
export interface DataStore<State> {
  getState: () => State;
  subscribe: (listener: () => void) => Unsubscribe;
}

interface MapDispatchToActionDictionary {
  readonly [key: string]: (() => any);
}

type MapDispatchToActionDictionaryFunction<A> =
  (dispatch: Dispatch<A>) => MapDispatchToActionDictionary;

interface MapStateToCallback<SR, ST> {
  selector: ((state: ST) => SR);
  callback: ((input: SR) => void);
}

interface MemoizedMapStateToCallbackData<SR, ST> extends MapStateToCallback<SR, ST>{
  previousResult: SR;
};

export interface SnaffleBit <ST>{
  // readonly dispatchDictionary: MapDispatchToActionDictionary;
  readonly createChild: (
    mapStateToCallbacks: MapStateToCallback<any, ST>[],
  //  mapDispatchToActionDictionary?: MapDispatchToActionDictionaryFunction<A>
  ) => SnaffleBit<ST>;
  readonly dispose: () => void
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

function createSnaffleBit <ST>(
  store: DataStore<ST>, 
  mapStateToCallbacks: MapStateToCallback<any, ST>[],
  // mapDispatchToActionDictionary?: MapDispatchToActionDictionaryFunction<A>
): SnaffleBit<ST> {

  const children: SnaffleBit<ST>[] = [];

  const handleChange =
    createHandleChangeFunctionFromMapStateToCallback(store,
      memoizeAndInitialCallMapStateToCallbacks(store, mapStateToCallbacks));

  var unsubscribe = store.subscribe(handleChange);

  // const dispatchDictionary = mapDispatchToActionDictionary ? 
  //   mapDispatchToActionDictionary(store.dispatch) :
  //   {};
  return {
    createChild: function(
      mapStateToCallbacks: MapStateToCallback<any, ST>[],
    //  mapDispatchToActionDictionary?: MapDispatchToActionDictionaryFunction<A>
    ) {
      const newSnaffle = createSnaffleBit(store, mapStateToCallbacks, /*mapDispatchToActionDictionary*/);
      children.push(newSnaffle);
      return newSnaffle;
    },
    // dispatchDictionary,
    dispose: function() {
      for (let i = 0; i < children.length; i ++) {
        children[i].dispose();
      }
      unsubscribe();
    }
  }
}

export const createSnaffleBitProvider = <ST>(store: DataStore<ST>) => {
  return {
    createRoot: (
      mapStateToCallbacks: MapStateToCallback<any, ST>[],
      // mapDispatchToActionDictionary?: MapDispatchToActionDictionaryFunction<A>
    ): SnaffleBit<ST> => createSnaffleBit(
      store, mapStateToCallbacks/*, mapDispatchToActionDictionary*/)
  };
};
