import { Object3D, MeshBasicMaterial, DoubleSide, Color, Vector3, MeshPhongMaterial } from 'three';
import { TetrahedronVisual } from './Tetrahedra';
import { getTetrahedronSamplesFromCubeSample,
  DensityCubeSample, CubeIndex, Point3DWithValue,
  Tetrahedron,
  DensityTetrahedronSample } from '../library/marchingTetra';

  const cubeIndexToPointWithValue = (cube: CubeIndex): Point3DWithValue => {
    switch (cube) {
      case 0: return {x: 0, y: 0, z:0, value: 0 };
      case 1: return {x: 1, y: 0, z:0, value: 0 };
      case 2: return {x: 1, y: 1, z:0, value: 0 };
      case 3: return {x: 0, y: 1, z:0, value: 0 };
      case 4: return {x: 0, y: 0, z:1, value: 0 };
      case 5: return {x: 1, y: 0, z:1, value: 0 };
      case 6: return {x: 1, y: 1, z:1, value: 0 };
      case 7: return {x: 0, y: 1, z:1, value: 0 };
    }
  };

const getTetrahedraShiftBaseOnCubeIndex = (tetraSample: DensityTetrahedronSample) => {
  const p0 = cubeIndexToPointWithValue(tetraSample.p0.cubeIndex);
  const p1 = cubeIndexToPointWithValue(tetraSample.p1.cubeIndex);
  const p2 = cubeIndexToPointWithValue(tetraSample.p2.cubeIndex);
  const p3 = cubeIndexToPointWithValue(tetraSample.p3.cubeIndex);
  return new Vector3(
    p0.x + p1.x + p2.x + p3.x,
    p0.y + p1.y + p2.y + p3.y,
    p0.z + p1.z + p2.z + p3.z,
  )
  .normalize();
};

export class DensityCubeSampleVisual extends Object3D {
  constructor (cubeSample: DensityCubeSample) {
    super();
   
    const mapSampleToData = (sample: DensityTetrahedronSample): Tetrahedron => {
      return {
        p0: cubeIndexToPointWithValue(sample.p0.cubeIndex),
        p1: cubeIndexToPointWithValue(sample.p1.cubeIndex),
        p2: cubeIndexToPointWithValue(sample.p2.cubeIndex),
        p3: cubeIndexToPointWithValue(sample.p3.cubeIndex),
      };
    }
    this.add(...getTetrahedronSamplesFromCubeSample(cubeSample)
      .map(tetra => {
        const data =  mapSampleToData(tetra);
        const shift = getTetrahedraShiftBaseOnCubeIndex(tetra);
        const color = new Color();
        color.setHex(0xffffff * Math.random());
        const visual = new TetrahedronVisual(data,
          new MeshPhongMaterial({ side: DoubleSide, color, }));
        visual.position.add(shift);  
        return visual;
      })
    );
  }
}
