import { Group, Mesh, BoxGeometry } from 'three';
import { reduxMock } from '../../index';
import { createSelector } from 'reselect';

interface UpdateData {
  x: number;
  y: number;
  z: number;
}

export class Level extends Group {
  private boxTest: Mesh;
  constructor() {
    super();
    this.boxTest = new Mesh(new BoxGeometry(1, 1, 1));
    this.add(this.boxTest);
    this.add(new Mesh(new BoxGeometry(1, 1, 1)));
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
    this.boxTest.position.set(data.x, data.y, data.z)
  }

  public onLoadLevel() {
    console.log('yes');
  }

  public onUnloadLevel() {

  }

  public dispose() {
    
  }

}
