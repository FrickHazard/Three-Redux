import { Group, Mesh, BoxGeometry } from 'three';

export class Level extends Group {
  constructor() {
    super();
    this.add(new Mesh(new BoxGeometry(1, 1, 1)));
  }
  public onLoadLevel() {

  }

  public onUnloadLevel() {

  }

}