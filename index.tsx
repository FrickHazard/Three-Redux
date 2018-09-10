import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Main } from './src/component/Main';
import { rootReducer } from './src/state/reducer/index';
​
const store = createStore(rootReducer)
​
render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('root')
)