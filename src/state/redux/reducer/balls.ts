import { ActionType } from "./types";

type Ball = {
  x: number,
  y: number,
  z: number,
}

export type BallState = ReadonlyArray<Ball>;

const initialState: BallState = [{ x: 0, y: 0, z:0 }];

export const balls = (state: BallState = initialState, action: ActionType): BallState => {
  switch (action.type) {
    case 'SET_BALL_STATE':{
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
  