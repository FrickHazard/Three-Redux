import { DataStore } from '../../snaffle-bit';
import { createSubscribeAndSignalChangeFunctions } from '../../snaffle-bit/subscriptionFactory';
import { RigidbodyData } from '../../library/physics';

interface RigidbodyDataStore extends DataStore<Readonly<RigidbodyData>[]> {
  registerRigidBody: (data: RigidbodyData) => void;
  deregisterRigidBody: (data: RigidbodyData) => void;
};

export function createRigidbodyDataStore(): RigidbodyDataStore {
  let state: RigidbodyData[] = [];

  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions();

  return {
    getState: function() {
      return state;
    },
    subscribe,
    registerRigidBody: function(data: RigidbodyData) {
      state.push(data);
      signalChange();
    },
    deregisterRigidBody: function(data: RigidbodyData) {
      const index = state.findIndex(x => x === data);
      if (index === -1) throw new Error('Could not deregister rigidbody');
      state.splice(index, 1);
      signalChange();
    },
  };
};
