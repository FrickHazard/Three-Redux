import { combineReducers } from 'redux';
import { balls } from './balls';
import { mainMenu } from './mainMenu'
import { color } from './color';
import { isoLevel } from './isoLevel';
import { application } from './application';

export const rootReducer = combineReducers({
  balls,
  mainMenu,
  color,
  isoLevel,
  application,
});

export type StateType = ReturnType<typeof rootReducer>;
