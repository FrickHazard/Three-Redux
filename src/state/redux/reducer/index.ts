import { combineReducers } from 'redux';
import { balls } from './balls';
import { mainMenu } from './mainMenu'
import { color } from './color';
import { isoLevel } from './isoLevel';

export const rootReducer = combineReducers({
  balls,
  mainMenu,
  color,
  isoLevel,
});

export type StateType = ReturnType<typeof rootReducer>;
