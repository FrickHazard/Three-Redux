import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Body } from './src/component/Body';
import { rootReducer } from './src/state/redux/reducer/index';
import { createSnaffleBitProvider } from './src/snaffle-bit/index';
import { createPlayerTransformLogDataStore } from './src/state/playerTransformLoggerStore';
import { createFrameDataStore } from './src/state/frameDataStore';

const store = createStore(rootReducer);
export const reduxBit = createSnaffleBitProvider(store, { dispatch: store.dispatch });
export type ReduxSnaffleBit = ReturnType<typeof reduxBit.createRoot>;

const playerTransformLogStore = createPlayerTransformLogDataStore();
export const playerTransformLogSnaffleBitProvider = createSnaffleBitProvider(playerTransformLogStore, {
  logPlayerTransform: playerTransformLogStore.logPlayerTransform,
});
export type PlayerTransformLogSnaffleBit = ReturnType<typeof playerTransformLogSnaffleBitProvider.createRoot>;

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