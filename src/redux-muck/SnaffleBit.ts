import { Subscription } from './subscription';
import { Store } from 'redux';
import shallowEqual from './shallowEqual';


let getStore: (() => Store) = () => { throw new Error('redux muck was not intialized!'); };

export const intializeReduxMuck = (store: Store) => {
  getStore = () => store;
};


export class SnaffleBit {
  private dispatchObject: {
    [acionName: string]: () => void
  } = {};
  private sub: Subscription<any>;
  public children: SnaffleBit[] = [];
  public constructor(
    parentSub: Subscription<any> | null,
    mapStateToCallbacks: MapStateToCallback<any>[],
  ) {
    const handleChange =
      createHandleChangeFunctionFromMapStateToCallback(memoizeMapStateToCallbacks(mapStateToCallbacks));
    this.sub = new Subscription(getStore(), parentSub, handleChange);
    this.sub.trySubscribe();
  }

  public dispose() {
    this.sub.tryUnsubscribe();
  }
}

function memoizeMapStateToCallbacks<T>
(mapStateToCallbackData: MapStateToCallback<T>[]): MemoizedMapStateToCallbackData<T>[] {
  return mapStateToCallbackData.map(mapStateToCallback => {
    return {
      selector: mapStateToCallback.selector,
      callback: mapStateToCallback.callback,
      previousResult: mapStateToCallback.selector(getStore().getState()),
    };
  });
}

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
      if (shallowEqual(mapStateData.previousResult, selectorResult)) {
        mapStateData.callback(selectorResult);
      }
    }
  }
};
