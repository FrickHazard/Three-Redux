import { ActionType } from './types';

export type ColorState = Readonly<{
  color: number;
}>;

const initialState: ColorState = {
  color: 0xff0000
};

export const color = (state: ColorState = initialState, action: ActionType): ColorState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
  