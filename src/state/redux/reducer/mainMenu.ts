import { ActionType } from './types';

export type MainMenuState = Readonly<{
  gameStarted: boolean;
  rightToolbarOpen: boolean;
  headerHeight: number;
  rightToolbarWidth: number;
}>;

const initialState: MainMenuState = {
  gameStarted: false,
  rightToolbarOpen: false,
  headerHeight: 25,
  rightToolbarWidth: 250,
};

export const mainMenu = (state: MainMenuState = initialState, action: ActionType): MainMenuState => {
  switch (action.type) {
    case'SET_RIGHT_TOOLBAR_OPEN': {
      return { ...state, rightToolbarOpen: action.payload };
    }
    default: {
      return state;
    }
  }
};
  