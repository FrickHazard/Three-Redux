import { combineReducers } from 'redux';
import { balls } from './balls';
import { mainMenu } from './mainMenu'
import { color } from './color';

export const rootReducer = combineReducers({
  balls,
  mainMenu,
  color,
});

export type StateType = ReturnType<typeof rootReducer>;
