import { ActionType } from './types';

export type MainMenuState = Readonly<{
  gameStarted: boolean;
}>;

const initialState: MainMenuState = {
  gameStarted: false
};

export const mainMenu = (state: MainMenuState = initialState, action: ActionType): MainMenuState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
  