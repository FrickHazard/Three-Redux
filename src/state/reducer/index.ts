import { combineReducers } from 'redux';
import { ballState } from './ballReducer';

export const rootReducer = combineReducers({
  ballState,
});
