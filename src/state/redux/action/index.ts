import { BallState } from '../reducer/balls';
import { ThunkAction } from 'redux-thunk';
import { StateType } from '../reducer/index';

export type ActionType =
  { type: 'SET_BALL_STATE', payload: BallState } |
  { type: 'SET_MAIN_MENU' } |
  { type: 'SET_RIGHT_TOOLBAR_OPEN', payload: boolean } |
  { type: 'SET_ISO_LEVEL', payload: number };

export const actionAtlas = {
  setBall(payload: BallState) {
    return { type: 'SET_BALL_STATE', payload };
  },
  setRightToolbarOpen(payload: boolean) {
    return { type: 'SET_RIGHT_TOOLBAR_OPEN', payload };
  }
};

export function logState(): ThunkAction<void, StateType, void, ActionType> {
  return function(dispatch, getState) {
    console.log(getState());
  }
};
