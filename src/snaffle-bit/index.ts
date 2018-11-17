import { Subscription } from './subscription';
import shallowEqual from './shallowEqual';

type Unsubscribe = () => void;

type Dispatch <Action> = (action: Action) => Action;

// more or less copied from redux
export interface DataStore<State, Action> {
  getState: () => State;
  dispatch: Dispatch<Action>,
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

export interface SnaffleBit <ST, A>{
  readonly dispatchDictionary: MapDispatchToActionDictionary;
  readonly createChild: (
    mapStateToCallbacks: MapStateToCallback<any, ST>[],
    mapDispatchToActionDictionary?: MapDispatchToActionDictionaryFunction<A>
  ) => SnaffleBit<ST, A>;
  readonly dispose: () => void
}

function memoizeAndInitialCallMapStateToCallbacks<ST,SR>(
  store: DataStore<ST, any>,
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
  store: DataStore<ST, any>,
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

function createSnaffleBit <ST, A>(
  store: DataStore<ST, A>, 
  mapStateToCallbacks: MapStateToCallback<any, ST>[],
  mapDispatchToActionDictionary?: MapDispatchToActionDictionaryFunction<A>
): SnaffleBit<ST, A> {

  const children: SnaffleBit<ST, A>[] = [];

  const handleChange =
    createHandleChangeFunctionFromMapStateToCallback(store,
      memoizeAndInitialCallMapStateToCallbacks(store, mapStateToCallbacks));

  const subscription = new Subscription(store.subscribe, handleChange);
  subscription.trySubscribe();

  const dispatchDictionary = mapDispatchToActionDictionary ? 
    mapDispatchToActionDictionary(store.dispatch) :
    {};
  return {
    createChild: function(
      mapStateToCallbacks: MapStateToCallback<any, ST>[],
      mapDispatchToActionDictionary?: MapDispatchToActionDictionaryFunction<A>
    ) {
      const newSnaffle = createSnaffleBit(store, mapStateToCallbacks, mapDispatchToActionDictionary);
      children.push(newSnaffle);
      return newSnaffle;
    },
    dispatchDictionary,
    dispose: function() {
      for (let i = 0; i < children.length; i ++) {
        children[i].dispose();
      }
      subscription.tryUnsubscribe();
    }
  }
}

export const createSnaffleBitProvider = <ST, A>(store: DataStore<ST, A>) => {
  return {
    createRoot: (
      mapStateToCallbacks: MapStateToCallback<any, ST>[],
      mapDispatchToActionDictionary?: MapDispatchToActionDictionaryFunction<A>
    ): SnaffleBit<ST, A> => createSnaffleBit(store, mapStateToCallbacks, mapDispatchToActionDictionary)
  };
};
