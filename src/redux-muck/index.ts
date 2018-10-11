import { Store } from 'redux';

export interface Subscription <State, Result>{
  selector: (input: State) => Result;
  callback: (sr: Result) => any;
}

export interface InstanceSubscription<State, Result> extends Subscription<State, Result> {
  instance: object;
}

export class ReduxMuck<
S extends ReturnType<T['getState']>,
T extends Store> {
  private readonly store: T;
  private previousState: S | undefined = undefined;
  private currentState: S | undefined = undefined;
  private subscribedSelectors: Subscription<S, any>[] = [];
  private instanceSelectors: InstanceSubscription<S, any>[] = []
  constructor(store: T) {
    this.store = store;
    this.onSubscribe();
    store.subscribe(this.onSubscribe);
  }

  public addInstanceBasedSubscription<Result>(
    instance: object,
    subscription: Subscription<S, Result>
  ) {
    this.instanceSelectors.push({
      instance,
      callback: subscription.callback,
      selector: subscription.selector,
    });
    if (this.currentState) {
      subscription.callback(subscription.selector(this.currentState));
    }
  }

  public removeInstanceBasedSubscription<Result>(instance: object, subscription: Subscription<S, Result>) {
    const subIndex = this.instanceSelectors.findIndex(
      (sub: InstanceSubscription<S, Result>) => {
      return sub.callback === subscription.callback &&
        sub.instance === instance &&
        sub.selector === subscription.selector;
    });
    if (subIndex !== -1) {
      this.instanceSelectors.splice(subIndex, 1);
    }
  }

  public addGlobalSelector<SR>(subscription: Subscription<S, SR>) {
    this.subscribedSelectors.push(subscription);
  }

  private onSubscribe = () => {
    this.previousState = this.currentState;
    this.currentState = this.store.getState();
    for (const selectorWithCallback of this.instanceSelectors) {
      if (!this.currentState) {
        return;
      }
      const currentStateSelectorResult = selectorWithCallback.selector(this.currentState);
      if (!this.previousState) {
        selectorWithCallback.selector(currentStateSelectorResult);
        return;
      }
      const previousStateSelectorResult = selectorWithCallback.selector(this.previousState);
      if (previousStateSelectorResult !== currentStateSelectorResult) {
        selectorWithCallback.callback(currentStateSelectorResult);
      }
    }
  }
}