import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { Body } from './src/component/Body';
import { rootReducer } from './src/state/redux/reducer/index';
import { createRigidbodyDataStore } from './src/state/dataStore/rigidbodies';
import { createFrameDataStore } from './src/state/dataStore/frame';
import { createInputDataStore } from './src/state/dataStore/input';
import { createPlayerTransformDataStore } from './src/state/dataStore/playerTransform';

export const reduxDataStore = createStore(rootReducer, applyMiddleware(thunk));

export const frameDataStore = createFrameDataStore();

export const inputDataStore = createInputDataStore();

export const playerTransformDataStore = createPlayerTransformDataStore();

export const rigidbodyStore = createRigidbodyDataStore();

render(
  <Provider store={reduxDataStore}>
    <Body />
  </Provider>,
  document.getElementById('root')
);