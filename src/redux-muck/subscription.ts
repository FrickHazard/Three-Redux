import { Store } from 'redux';

const CLEARED = null;

type Listener = (() => void);
type Unsubscribe = (() => void);
type ListenerCollection = {
  notify: (() => void);
  clear:(() => void);
  subscribe: (listener: Listener) => Unsubscribe;
  get: () => Listener[]; 
}

function listenersWereClearedError() {
  return new Error('Listeners were cleared');
}

function createListenerCollection(): ListenerCollection {
  let current: Listener[] | null = [];
  let next:Listener[] | null = [];

  return {
    clear() {
      next = CLEARED
      current = CLEARED
    },

    notify() {
      const listeners = current = next
      if (!listeners) throw listenersWereClearedError()
      for (let i = 0; i < listeners.length; i++) {
        listeners[i]()
      }
    },

    get() {
      if (!next) throw new Error('Listener were cleared');
      return next
    },

    subscribe(listener) {
      let isSubscribed = true
      if (current === null || next === null) throw listenersWereClearedError()
      if (next === current) next = current.slice()
      next.push(listener)

      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED || next === CLEARED) return
        isSubscribed = false

        if (next === current) next = current.slice()
        next.splice(next.indexOf(listener), 1)
      }
    }
  }
}

export class Subscription<ST extends Store> {
  private store: ST;
  private parentSub: Subscription<ST> | null;
  private onStateChange: () => any;
  private unsubscribe: Unsubscribe | null;
  private listenerCollection: ListenerCollection | null;
  constructor(store: ST, parentSubscription: Subscription<ST> | null, onStateChange: () => any) {
    this.store = store
    this.parentSub = parentSubscription
    this.onStateChange = onStateChange
    this.unsubscribe = null
    this.listenerCollection = null;
  }

  addNestedSub(listener: Listener) {
    this.trySubscribe()
    // trySubscribe guarntees the listenerCollection will exist
    return this.listenerCollection!.subscribe(listener)
  }

  notifyNestedSubs() {
    if (this.listenerCollection) {
      this.listenerCollection.notify()
    }
  }

  isSubscribed() {
    return Boolean(this.unsubscribe)
  }

  trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub
        ? this.parentSub.addNestedSub(this.onStateChange)
        : this.store.subscribe(this.onStateChange)
 
      this.listenerCollection = createListenerCollection()
    }
  }

  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
      // if unsubscribe exists the listenerCollection should exist
      this.listenerCollection!.clear()
      this.listenerCollection = null
    }
  }
}
