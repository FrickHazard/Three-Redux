import { Subscription } from './subscription';
import { Store, Dispatch } from 'redux';
import shallowEqual from './shallowEqual';


let getStore: (() => Store) = () => { throw new Error('redux muck was not intialized!'); };

export const intializeReduxMuck = (store: Store) => {
  getStore = () => store;
};

export class SnaffleBit {
  public readonly dispatchObject: MapDispatchToActionObject;
  private sub: Subscription<any>;
  public children: SnaffleBit[] = [];
  public constructor(
    parentSub: Subscription<any> | null,
    mapStateToCallbacks: MapStateToCallback<any>[],
    mapDispatchToActionFunction?: MapDispatchToObjectFunction,
  ) {
    const handleChange =
      createHandleChangeFunctionFromMapStateToCallback(memoizeAndInitialCallMapStateToCallbacks(mapStateToCallbacks));
    this.sub = new Subscription(getStore(), parentSub, handleChange);
    this.sub.trySubscribe();
    this.dispatchObject = mapDispatchToActionFunction ? 
      mapDispatchToActionFunction(getStore().dispatch):
      {};
  }

  public dispose() {
    this.sub.tryUnsubscribe();
  }
}

function memoizeAndInitialCallMapStateToCallbacks<T>
(mapStateToCallbackData: MapStateToCallback<T>[]): MemoizedMapStateToCallbackData<T>[] {
  const state = getStore().getState();
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

interface MapDispatchToActionObject {
  readonly [key: string]: (() => any);
}

type MapDispatchToObjectFunction = (dispatch: Dispatch) => MapDispatchToActionObject;

interface MapStateToCallback<T> {
  selector: ((state: any) => T);
  callback: ((input: T) => void);
}

interface MemoizedMapStateToCallbackData<T> extends MapStateToCallback<T>{
  previousResult: T;
};

function createHandleChangeFunctionFromMapStateToCallback(
  mapStateToCallbackData: MemoizedMapStateToCallbackData<any>[]) {
  return function() {
    for (const mapStateData of mapStateToCallbackData) {
      const selectorResult = mapStateData.selector(getStore().getState());
      if (!shallowEqual(mapStateData.previousResult, selectorResult)) {
        mapStateData.callback(selectorResult);
        mapStateData.previousResult = selectorResult;
      }
    }
  }
};
