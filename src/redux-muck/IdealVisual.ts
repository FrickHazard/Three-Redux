import { Mesh, SphereBufferGeometry, MeshBasicMaterial, Color } from 'three';
import { createStoreSubscriptions, createMapStateChange } from 'redux-muck';
import { StateType } from '../state/reducer/index';


const staticBallGeometry = new SphereBufferGeometry(1, 16, 16);

export class IdealApiExample extends Mesh {
  constructor() {
    super(staticBallGeometry, new MeshBasicMaterial({
      color: 0xff0000
    }));
  }

  public updatePosition(position: { x: number; y: number; z: number; }) {
    this.position.set(position.x, position.y, position.z);
  }

  public updateColor(color: Color) {
    (this.material as MeshBasicMaterial).color = color;
  }
}

const updatePosition = <IdealApiExample>createMapStateChange({
  callback: 'updatePosition',
  selector: (state: StateType) => {
    return {
      x:state.balls[0].x,
      y:state.balls[0].y,
      z:state.balls[0].z,
    }
  },
});

const updateColor = <IdealApiExample>createMapStateChange({
  callback: 'updateColor',
  selector: (state: StateType) => {
    return {
      x:state.balls[0].x,
      y:state.balls[0].y,
      z:state.balls[0].z,
    }
  },
});

export default createStoreSubscriptions(updatePosition, updateColor)(IdealApiExample);