import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Body } from './src/component/Body';
import { rootReducer } from './src/state/redux/reducer/index';
import { createSnaffleBitProvider } from './src/snaffle-bit/index';
import { createPlayerDataStore } from './src/state/playerStore';
import { createFrameDataStore } from './src/state/frameStore';

const store = createStore(rootReducer);
export const reduxBit = createSnaffleBitProvider(store, { dispatch: store.dispatch });
export type ReduxSnaffleBit = ReturnType<typeof reduxBit.createRoot>;

const playerStore = createPlayerDataStore();
export const playerBit = createSnaffleBitProvider(playerStore, {
  set: playerStore.set,
});
export type PlayerSnaffleBit = ReturnType<typeof playerBit.createRoot>;

const frameDataStore = createFrameDataStore();
export const frameBit = createSnaffleBitProvider(frameDataStore, {
  addPlayerLookInput: frameDataStore.addPlayerLookInput,
  addPlayerMovementInput: frameDataStore.addPlayerMovementInput,
  computeFrameData: frameDataStore.computeFrameData,
});
export type FrameDataSnaffleBit = ReturnType<typeof frameBit.createRoot>;

render(
  <Provider store={store}>
    <Body />
  </Provider>,
  document.getElementById('root')
);