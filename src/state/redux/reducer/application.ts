import { ActionType } from "../action";

type Application = {
  playerMoveSpeedPerSecond: number;
  playerLookSpeedPerSecond: number;
}

export type ApplicationState = Readonly<Application>;

const initialState: ApplicationState = {
  playerMoveSpeedPerSecond: 0.5,
  playerLookSpeedPerSecond: 0.2,
};

export const application = (state: ApplicationState = initialState, action: ActionType): ApplicationState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
  