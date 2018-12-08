import {
  Group, Mesh, SphereGeometry, DirectionalLight,
  MeshPhongMaterial, AmbientLight,
  LineSegments, DoubleSide, LineBasicMaterial,
  PointLight,
} from 'three';
import { StateType } from '../state/redux/reducer/index'; 
import { reduxBit, ReduxSnaffleBit } from '../../index';
import { BallGrid } from './BallGrid';
import { buildChunk } from '../library/marchingTetra';
import { createVoxelScalarField } from '../library/VoxelScalarField';
import { DensityCubeSampleVisual } from '../three/DensityCubeSampleDebug';
import { createAABBGeometry } from '../library/aabbDebug';
import { TetrahedronVisual } from '../three/Tetrahedra';

interface UpdateData {
  x: number;
  y: number;
  z: number;
}

export class Level extends Group {
  private ball: Mesh;
  private bit: ReduxSnaffleBit;
  private sun: DirectionalLight;
  private ambientLight: AmbientLight;
  constructor() {
    super();
    this.ball = new Mesh(new SphereGeometry(1, 12, 12));
    this.ambientLight = new AmbientLight(0x202090, 1.0);
    this.sun = new DirectionalLight(0x202090, 2);
    this.sun.position.set(1, 1, 1).normalize();
    const aabb =  {
      maxX:  1.5,
      maxY:  1.5,
      maxZ:  1.5,
      minX: -1.5,
      minY: -1.5,
      minZ: -1.5,
    };
    // const test = new Mesh(buildChunk(
    //   createVoxelScalarField({ x: 0, y: 0, z: 0 }, 1,
    //     [
    //       [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
    //       [[0, 0, 0], [1, 1, 1], [0, 0, 0]],
    //       [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    //     ],
    //   ),
    //   aabb,
    //   3,
    //   1,
    // ), new MeshPhongMaterial({ color: 0xffffff, side: DoubleSide }));
    //     this.add(test);
    this.add(new LineSegments(createAABBGeometry(aabb, 3),
      new LineBasicMaterial()));
    this.add(new TetrahedronVisual({
      p0: {
        value: 0,
        x: - 1.5,
        y: - 0.5,
        z: - 1.5
      },
      p1: {
        value: 0,
        x: - 1.5,
        y: - 0.5,
        z: - 0.5
      },
      p2: {
        value: 0,
        x: - 1.5,
        y:   0.5,
        z: - 1.5
      },
      p3: {
        value: 0,
        x: - 0.5,
        y:   0.5,
        z: - 0.5
      },
    }, new MeshPhongMaterial({ side: DoubleSide, color: 0xff0000 })));
    // this.add(this.ball);
    // this.add(new BallGrid());
    this.add(this.sun);
    this.add(this.ambientLight);
    this.add(new PointLight(0x303030, 3));
    this.add(new DensityCubeSampleVisual([
      0, 0, 0, 0, 0, 0, 0, 0,
    ]))
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
