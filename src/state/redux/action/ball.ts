import { actionAtlas } from '../reducer/types';

export const setBallPosition = (x: number, y: number, z: number) => {
  return actionAtlas.setBall([{
    x,
    y,
    z,
  }]);
};

export const setRightToolbarStatus = (status: null | number) => {
  return actionAtlas.setRightToolbarStatus(status);
}
