import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Body } from './src/component/Body';
import { rootReducer } from './src/state/redux/reducer/index';
import { createSnaffleBitProvider, SnaffleBit } from './src/snaffle-bit/index';
import { createPlayerDataStore } from './src/state/playerStore';

const store = createStore(rootReducer);
export const reduxBit = createSnaffleBitProvider(store);
export type ReduxSnaffleBit = ReturnType<typeof reduxBit.createRoot>
export const playerBit = createSnaffleBitProvider(createPlayerDataStore());
export type PlayerSnaffleBit = ReturnType<typeof playerBit.createRoot>;

render(
  <Provider store={store}>
    <Body />
  </Provider>,
  document.getElementById('root')
);