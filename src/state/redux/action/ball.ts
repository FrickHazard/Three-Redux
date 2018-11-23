import { actionAtlas } from '../reducer/types';

export const setBallPosition = (x: number, y: number, z: number) => {
  return actionAtlas.setBall([{
    x,
    y,
    z,
  }]);
};

export const setRightToolbarOpen = (open: boolean) => {
  return actionAtlas.setRightToolbarOpen(open);
}
