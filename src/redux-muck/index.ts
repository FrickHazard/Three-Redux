import { Store, Action } from 'redux';
import { Selector } from 'reselect';

interface SubscribedSelector <S, SR>{
  selector: Selector<S, SR>;
  callback: (sr: SR) => any;
}

export class ReduxMuck<S, A extends Action, T extends Store<S, A>> {
  private readonly store: T;
  private previousState: S | undefined = undefined;
  private currentState: S | undefined = undefined;
  private subscribedSelectors: SubscribedSelector<S, any>[] = [];
  constructor(store: T) {
    this.store = store;
    this.onSubscribe();
    store.subscribe(this.onSubscribe);
  }

  public addGlobalSelector<SR>(selectorSubscription: SubscribedSelector<S, SR>) {
    this.subscribedSelectors.push(selectorSubscription);
  }

  private onSubscribe = () => {
    this.previousState = this.currentState;
    this.currentState = this.store.getState();
    for (const selectorWithCallback of this.subscribedSelectors) {
      if (
        !this.previousState ||
        selectorWithCallback.selector(this.currentState) !==
          selectorWithCallback.selector(this.previousState)
      ) {
        selectorWithCallback.callback(selectorWithCallback.selector(this.currentState));
      }
    }
  }
}