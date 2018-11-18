import { Group, Mesh, SphereGeometry, DirectionalLight } from 'three';
import { StateType } from '../state/redux/reducer/index'; 
import { reduxBit, ReduxSnaffleBit } from '../../index';
import { BallGrid } from './BallGrid';

interface UpdateData {
  x: number;
  y: number;
  z: number;
}

export class Level extends Group {
  private ball: Mesh;
  private bit: ReduxSnaffleBit;
  private light: DirectionalLight;
  constructor() {
    super();
    this.ball = new Mesh(new SphereGeometry(1, 12, 12));
    this.light = new DirectionalLight(0xffffff, 40);
    this.light.position.set(1, 1, 1).normalize();
    this.add(this.ball);
    this.add(new BallGrid());
    this.add(this.light);
    const ballUpdate = {
      callback: this.update,
      selector: (state: StateType) => {
        return {
          x:state.balls[0].x,
          y:state.balls[0].y,
          z:state.balls[0].z,
        }
      },
    };
    this.bit = reduxBit.createRoot([ballUpdate]);
  }

  public update = (data: UpdateData) => {
    this.ball.position.set(data.x, data.y, data.z)
  }

  public onLoadLevel() {
    console.log('yes');
  }

  public onUnloadLevel() {

  }

  public dispose() {
    this.bit.dispose();
  }

}
