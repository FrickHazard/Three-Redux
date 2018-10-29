import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Body } from './src/component/Body';
import { rootReducer } from './src/state/reducer/index';
import { intializeReduxMuck } from './src/redux-muck/index';

​
const store = createStore(rootReducer);
intializeReduxMuck(store); 

render(
  <Provider store={store}>
    <Body />
  </Provider>,
  document.getElementById('root')
);