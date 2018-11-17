export type StateSubscription = ((func: () => any) => () => any | null | undefined);

export class Subscription {
  private stateSubscription: StateSubscription;
  private onStateChange: () => any;
  private unsubscribe: (() => any) | null;
  constructor(stateSubscription: StateSubscription, onStateChange: () => any) {
    this.stateSubscription = stateSubscription
    this.onStateChange = onStateChange
    this.unsubscribe = null
  }

  isSubscribed() {
    return Boolean(this.unsubscribe)
  }

  trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.stateSubscription(this.onStateChange)
    }
  }

  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }
}
