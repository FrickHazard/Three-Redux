import { ActionType } from '../action';

export type IsoLevelState = number;

const initialState = 0;

export const isoLevel = (state: IsoLevelState = initialState, action: ActionType): IsoLevelState => {
  switch (action.type) {
    case 'SET_ISO_LEVEL': {
      return action.payload;
    } 
    default: {
      return state;
    }
  }
};
  