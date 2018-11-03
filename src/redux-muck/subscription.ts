import { Store } from 'redux';

export class Subscription<ST extends Store> {
  private store: ST;
  private onStateChange: () => any;
  private unsubscribe: (() => any) | null;
  constructor(store: ST, onStateChange: () => any) {
    this.store = store
    this.onStateChange = onStateChange
    this.unsubscribe = null
  }

  isSubscribed() {
    return Boolean(this.unsubscribe)
  }

  trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.store.subscribe(this.onStateChange)
    }
  }

  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }
}
