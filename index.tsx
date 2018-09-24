import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Body } from './src/component/Body';
import { ReduxMuck } from './src/redux-muck';
import { rootReducer } from './src/state/reducer/index';
​
const store = createStore(rootReducer);
export const reduxMock = new ReduxMuck(store);
​
render(
  <Provider store={store}>
    <Body />
  </Provider>,
  document.getElementById('root')
);