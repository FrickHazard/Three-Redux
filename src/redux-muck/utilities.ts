import { Subscription } from './index'

export const createHomogenousSelectorSubscription = <T, Result>(selector: (input: T) => Result): Subscription<T, Result> => {
  return {
    callback: (A: ReturnType<typeof selector>) => A,
    selector: selector,
  }
};
