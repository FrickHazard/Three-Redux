import { BallState } from './ball';

export type ActionType =
  { type: 'SET_BALL_STATE', payload: BallState } |
  { type: 'SET_MAIN_MENU' } ;

export const actionAtlas = {
  setBall(payload: BallState) {
    return { type: 'SET_BALL_STATE', payload };
  }
}
