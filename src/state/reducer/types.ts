import { BallState } from './ball';
import { rootReducer } from './index';

export type ActionType =
  { type: 'SET_BALL_STATE', payload: BallState } |
  { type: 'SET_MAIN_MENU' } ;

export const actionAtlas = {
  setBall(payload: BallState) {
    return { type: 'SET_BALL_STATE', payload };
  }
}

export type StateType = ReturnType<typeof rootReducer>;
