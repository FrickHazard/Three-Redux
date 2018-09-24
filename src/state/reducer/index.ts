import { combineReducers } from 'redux';
import { balls } from './balls';
import { mainMenu } from './mainMenu'

export const rootReducer = combineReducers({
  balls,
  mainMenu,
});

export type StateType = ReturnType<typeof rootReducer>;
