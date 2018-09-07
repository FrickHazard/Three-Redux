

export type BallState = Readonly<{
  balls: number[]
}>;

const initialState: BallState = {
  balls:[]
};

type Action = { type: string; payload: any; }

export const ballState = (state: BallState = initialState, action: Action): BallState => {
  switch (action.type) {

    default: {
      return state;
    }
  }
};
  