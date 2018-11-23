import { BallState } from './balls';

export type ActionType =
  { type: 'SET_BALL_STATE', payload: BallState } |
  { type: 'SET_MAIN_MENU' } |
  { type: 'SET_RIGHT_TOOLBAR_OPEN', payload: boolean };

export const actionAtlas = {
  setBall(payload: BallState) {
    return { type: 'SET_BALL_STATE', payload };
  },
  setRightToolbarOpen(payload: boolean) {
    return { type: 'SET_RIGHT_TOOLBAR_OPEN', payload };
  }
}
