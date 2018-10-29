import { Group, Mesh, SphereGeometry } from 'three';
// import { reduxMock } from '../../index';
import { StateType } from '../state/reducer/index'; 
import { SnaffleBit } from '../redux-muck'; 

interface UpdateData {
  x: number;
  y: number;
  z: number;
}

export class Level extends Group {
  private ball: Mesh;
  private bit: SnaffleBit;
  constructor() {
    super();
    this.ball = new Mesh(new SphereGeometry(1, 12, 12));
    this.add(this.ball);
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
    this.bit = new SnaffleBit(null, [ballUpdate]);
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
