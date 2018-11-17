import { Object3D, Mesh } from 'three';
import { boxGeometry } from './staticGeometry';
import { oddBoxSquareMaterial, evenBoxSquareMaterial } from './staticMaterial';

export class BallGrid extends Object3D {
  constructor() {
    super();
    this.buildGrid(10, 10);
  }

  private buildGrid (xCount: number, yCount: number) {
    const flooredXCount = Math.floor(xCount);
    const flooredYCount = Math.floor(yCount);
    const xCenteringShift = flooredXCount / 2;
    const yCenteringShift = flooredYCount / 2;
    for (let x = 0; x < flooredXCount; x ++) {
      for (let y = 0; y < flooredYCount; y++) {

        const boxMaterial = ((x % 2) + y) % 2 == 0 ?
          evenBoxSquareMaterial :
          oddBoxSquareMaterial;
        const boxMesh = new Mesh(boxGeometry, boxMaterial);
        boxMesh.position.set(-xCenteringShift + x, -yCenteringShift + y, 0);
        this.add(boxMesh);
      }
    }
  }
};
