import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Body } from './src/component/Body';
import { initializeReduxMuck } from './src/redux-muck';
import { rootReducer } from './src/state/reducer/index';
​
const store = createStore(rootReducer);
initializeReduxMuck(store);
​
render(
  <Provider store={store}>
    <Body />
  </Provider>,
  document.getElementById('root')
);