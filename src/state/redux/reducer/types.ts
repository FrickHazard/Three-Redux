import { BallState } from './balls';

export type ActionType =
  { type: 'SET_BALL_STATE', payload: BallState } |
  { type: 'SET_MAIN_MENU' } |
  { type: 'SET_MAIN_MENU_RIGHT_TOOLBAR', payload: number | null };

export const actionAtlas = {
  setBall(payload: BallState) {
    return { type: 'SET_BALL_STATE', payload };
  },
  setRightToolbarStatus(payload: number | null) {
    return { type: 'SET_MAIN_MENU_RIGHT_TOOLBAR', payload };
  }
}
