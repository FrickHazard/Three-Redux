import { combineReducers } from 'redux';
import { ball } from './ball';
import { mainMenu } from './mainMenu'

export const rootReducer = combineReducers({
  ball,
  mainMenu,
});
