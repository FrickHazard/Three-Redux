import { Subscribe } from './index';

export function createSubscribeAndSignalChangeFunctions<T extends any[]>()
: { subscribe: Subscribe<T>, signalChange: (...input : T) => void} {
  let currentListeners: ((...input : T) => void)[] = [];
  let nextListeners = currentListeners; 

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  function subscribe(listener: ((...input : T) => void)) {

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  function signalChange(...params: T) {
    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener(...params);
    }
  }

  return { subscribe, signalChange };
}