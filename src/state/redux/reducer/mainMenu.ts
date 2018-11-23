import { ActionType } from './types';

export type MainMenuState = Readonly<{
  gameStarted: boolean;
  rightToolbarStatus: number | null;
}>;

const initialState: MainMenuState = {
  gameStarted: false,
  rightToolbarStatus: null
};

export const mainMenu = (state: MainMenuState = initialState, action: ActionType): MainMenuState => {
  switch (action.type) {
    case'SET_MAIN_MENU_RIGHT_TOOLBAR': {
      return { ...state, rightToolbarStatus: action.payload };
    }
    default: {
      return state;
    }
  }
};
  