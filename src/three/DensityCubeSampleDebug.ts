import { Object3D, MeshBasicMaterial, MeshLambertMaterial } from 'three';
import { TetrahedronVisual } from './Tetrahedra';
import { getTetrahedronSamplesFromCubeSample,
  DensityCubeSample, CubeIndex, Point3DWithValue,
  Tetrahedron,
  DensityTetrahedronSample } from '../library/marchingTetra';

export class DensityCubeSampleVisual extends Object3D {
  constructor (cubeSample: DensityCubeSample) {
    super();
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
    const mapSampleToData = (sample: DensityTetrahedronSample): Tetrahedron => {
      return {
        p0: cubeIndexToPointWithValue(sample.p0.cubeIndex),
        p1: cubeIndexToPointWithValue(sample.p1.cubeIndex),
        p2: cubeIndexToPointWithValue(sample.p2.cubeIndex),
        p3: cubeIndexToPointWithValue(sample.p3.cubeIndex),
      };
    }
    this.add(...getTetrahedronSamplesFromCubeSample(cubeSample)
      .map(tetra => mapSampleToData(tetra))
      .map(data => new TetrahedronVisual(data, new MeshLambertMaterial())));
  }
}
