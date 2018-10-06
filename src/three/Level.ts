import { Group, Mesh, SphereGeometry } from 'three';
import { reduxMock } from '../../index';

interface UpdateData {
  x: number;
  y: number;
  z: number;
}

export class Level extends Group {
  private ball: Mesh;
  constructor() {
    super();
    this.ball = new Mesh(new SphereGeometry(1, 12, 12));
    this.add(this.ball);
    reduxMock.addInstanceBasedSubscription(this, {
      callback: this.update,
      selector: (state) => {
        return {
          x:state.balls[0].x,
          y:state.balls[0].y,
          z:state.balls[0].z,
        }
      },
    })
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
    
  }

}
