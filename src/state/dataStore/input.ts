import { DataStore } from '../../snaffle-bit'
import { createSubscribeAndSignalChangeFunctions } from '../../snaffle-bit/subscriptionFactory';

export type PlayerMovementInput = Readonly<{
  readonly up: boolean;
  readonly down: boolean,
  readonly left: boolean;
  readonly right: boolean;
  readonly forward: boolean;
  readonly back: boolean;
}>

export type PlayerLookInput = Readonly<{
  readonly up: boolean;
  readonly down: boolean,
  readonly left: boolean;
  readonly right: boolean;
}>;

type InputData = Readonly<{
  playerMovementInput: PlayerMovementInput;
  playerLookInput: PlayerLookInput;
}>

export interface InputDataStore extends DataStore<InputData> {
  setMoveUp: (value: boolean) => any;
  setMoveDown: (value: boolean) => any;
  setMoveLeft: (value: boolean) => any;
  setMoveRight: (value: boolean) => any;
  setMoveFoward: (value: boolean) => any;
  setMoveBack: (value: boolean) => any;
  setLookUp: (value: boolean) => any;
  setLookDown: (value: boolean) => any;
  setLookLeft: (value: boolean) => any;
  setLookRight: (value: boolean) => any;
};

export const createInputDataStore = (): InputDataStore => {
  let state: InputData = {
    playerLookInput:{
      down: false,
      left: false,
      right: false,
      up: false,
    },
    playerMovementInput: {
      back: false,
      down: false,
      forward: false,
      left: false,
      right: false,
      up: false,
    }
  };

  const { subscribe, signalChange } = createSubscribeAndSignalChangeFunctions();

  return {
    setMoveUp: function(value: boolean) {
      state = { ...state, playerMovementInput :
        { ...state.playerMovementInput, up: value } };
      signalChange();
    },
    setMoveDown: function(value: boolean) {
      state = { ...state, playerMovementInput :
        { ...state.playerMovementInput, down: value } };
      signalChange();
    },
    setMoveLeft: function(value: boolean) {
      state = { ...state, playerMovementInput :
        { ...state.playerMovementInput, left: value } };
      signalChange();
    },
    setMoveRight: function(value: boolean) {
      state = { ...state, playerMovementInput :
        { ...state.playerMovementInput, right: value } };
      signalChange();
    },
    setMoveFoward: function(value: boolean) {
      state = { ...state, playerMovementInput :
        { ...state.playerMovementInput, forward: value } };
      signalChange();
    },
    setMoveBack: function(value: boolean) {
      state = { ...state, playerMovementInput :
        { ...state.playerMovementInput, back: value } };
      signalChange();
    },
    setLookUp: function(value: boolean) {
      state = { ...state, playerLookInput :
        { ...state.playerLookInput, up: value } };
      signalChange();
    },
    setLookDown: function(value: boolean) {
      state = { ...state, playerLookInput :
        { ...state.playerLookInput, down: value } };
      signalChange();
    },
    setLookLeft: function(value: boolean) {
      state = { ...state, playerLookInput :
        { ...state.playerLookInput, left: value } };
      signalChange();
    },
    setLookRight: function(value: boolean) {
      state = { ...state, playerLookInput :
        { ...state.playerLookInput, right: value } };
      signalChange();
    },
    getState: () => state,
    subscribe,
  };
};
