// https://github.com/Calvin-L/MarchingTetrahedrons
// Copyright (c) 2012 Calvin Loncaric

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import { Geometry, Vector3, Face3 } from 'three';
import { Point3D } from './basicDataTypes';
import { ScalarField } from './ScalarField';
import { AABB } from './AABB';
import { type } from 'os';

export interface Point3DWithValue extends Point3D {
  value: number;
};

export interface Tetrahedron {
  p0: Point3DWithValue;
  p1: Point3DWithValue;
  p2: Point3DWithValue;
  p3: Point3DWithValue;
}

export function buildChunk (
  scalarField: ScalarField,
  aabb: AABB,
  resolution: number,
  isolevel: number,
): Geometry {
  const grid : number[][][] = [];
  const xRange = aabb.maxX - aabb.minX;
  const yRange = aabb.maxY - aabb.minY;
  const zRange = aabb.maxZ - aabb.minZ;

  for (let i = 0; i <= resolution; ++i) {
    let x = i/resolution * xRange + aabb.minX;
    grid.push([]);
    for (let j = 0; j <= resolution; ++j) {
        grid[i].push([]);
        let y = j / resolution * yRange + aabb.minY;
        for (let k = 0; k <= resolution; ++k) {
            let z = k/resolution * zRange + aabb.minZ;
            let value = scalarField.valueAt(x, y, z);
            grid[i][j][k] = value;
        }
    }
  }

  let verticeData: Point3D[] = [];

  for (let i = 0; i < resolution; ++i) {
    let x1 = i / resolution * xRange + aabb.minX;
    let x2 = (i + 1) / resolution * xRange + aabb.minX;
    for (let j = 0; j < resolution; ++j) {
        let y1 = j / resolution * yRange + aabb.minY;
        let y2 = (j + 1) / resolution * yRange + aabb.minY;
        for (let k = 0; k < resolution; ++k) {
          let z1 = k / resolution * zRange + aabb.minZ;
          let z2 = (k + 1) / resolution * zRange + aabb.minZ;

            /*
             Coordinates:
                  z
                  |
                  |___ y
                  /
                 /
                x
             Cube layout:
                4-------7
               /|      /|
              / |     / |
             5-------6  |
             |  0----|--3
             | /     | /
             |/      |/
             1-------2
             Tetrahedrons are:
                 0, 7, 3, 2
                 0, 7, 2, 6
                 0, 4, 6, 7
                 0, 6, 1, 2
                 0, 6, 1, 4
                 5, 6, 1, 4
             */

            const cubePoints: Point3DWithValue[] = [
              { x: x1, y: y1, z: z1, value: grid[i    ][j    ][k    ]},
              { x: x2, y: y1, z: z1, value: grid[i + 1][j    ][k    ]},
              { x: x2, y: y2, z: z1, value: grid[i + 1][j + 1][k    ]},
              { x: x1, y: y2, z: z1, value: grid[i    ][j + 1][k    ]},
              { x: x1, y: y1, z: z2, value: grid[i    ][j    ][k + 1]},
              { x: x2, y: y1, z: z2, value: grid[i + 1][j    ][k + 1]},
              { x: x2, y: y2, z: z2, value: grid[i + 1][j + 1][k + 1]},
              { x: x1, y: y2, z: z2, value: grid[i    ][j + 1][k + 1]}
            ];

            const tetrahedra: Tetrahedron[] = [
              { p0: cubePoints[0], p1: cubePoints[7], p2: cubePoints[3], p3: cubePoints[2] },
              { p0: cubePoints[0], p1: cubePoints[7], p2: cubePoints[2], p3: cubePoints[6] },
              { p0: cubePoints[0], p1: cubePoints[4], p2: cubePoints[7], p3: cubePoints[6] },
              { p0: cubePoints[0], p1: cubePoints[1], p2: cubePoints[6], p3: cubePoints[2] },
              { p0: cubePoints[0], p1: cubePoints[4], p2: cubePoints[6], p3: cubePoints[1] },
              { p0: cubePoints[5], p1: cubePoints[1], p2: cubePoints[6], p3: cubePoints[4] }
            ];

        for (let t = 0; t < 6; t++) {
          verticeData = verticeData.concat(buildTetrahedron(tetrahedra[t], isolevel));
        }
      }
    }
  }
  const geometry = new Geometry();
  geometry.vertices = verticeData.map(data =>
    new Vector3(data.x, data.y, data.z));
  const faces: Face3[] = [];
  for (let i = 0; i < (verticeData.length / 3); i++) {
    faces.push(new Face3((i * 3) + 0,(i * 3) + 1 ,(i * 3) + 2));
  }
  geometry.faces = faces;
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere(); 
  return geometry;
};

export function buildTetrahedron(
  tetrahedron: Tetrahedron,
  isolevel: number,
): Point3D[]{
    /*
     Tetrahedron layout:
           0
           *
          /|
         / |
      3 *-----* 1
         \ | / 
          \|/
           *
           2
     */
    let index = 0;
    if (tetrahedron.p0.value < isolevel)
    index |= (1 << 0);
    if (tetrahedron.p1.value < isolevel)
    index |= (1 << 1);
    if (tetrahedron.p2.value < isolevel)
    index |= (1 << 2);
    if (tetrahedron.p3.value < isolevel)
    index |= (1 << 3);

    switch (index) {

        case 0x00:
        case 0x0F:
            return [];
        // single point leaving iso space
        case 0x01:
          return [
            buildVert(tetrahedron.p0, tetrahedron.p1, isolevel),
            buildVert(tetrahedron.p0, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p0, tetrahedron.p2, isolevel)
          ];

        case 0x02:
          return [
            buildVert(tetrahedron.p1, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel)
          ];

        case 0x04:
          return [
            buildVert(tetrahedron.p2, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p1, isolevel)
          ];

        case 0x08:
          return [
            buildVert(tetrahedron.p3, tetrahedron.p1, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p0, isolevel)
          ];

        //  pair cases
        case 0x03:
          return [
            buildVert(tetrahedron.p3, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel),

            buildVert(tetrahedron.p2, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p1, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel)
          ];

        case 0x05:
          return [
            buildVert(tetrahedron.p3, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p0, isolevel),

            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel)
          ];

        case 0x09:
          return [
            buildVert(tetrahedron.p0, tetrahedron.p1, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p0, tetrahedron.p2, isolevel),

            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p0, tetrahedron.p2, isolevel)
          ]

        case 0x06:
          return [
            buildVert(tetrahedron.p0, tetrahedron.p1, isolevel),
            buildVert(tetrahedron.p0, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel),

            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p0, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p2, isolevel)
          ]

        case 0x0C:
          return [
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p0, isolevel),

            buildVert(tetrahedron.p2, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p1, isolevel)
          ];

        case 0x0A:
          return [
            buildVert(tetrahedron.p3, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel),

            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p0, isolevel),
          ];

        case 0x07:
          return [
            buildVert(tetrahedron.p3, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p3, tetrahedron.p1, isolevel),
          ];

        case 0x0B:
          return [
            buildVert(tetrahedron.p2, tetrahedron.p1, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p2, tetrahedron.p0, isolevel)
          ];

        case 0x0D:
          return [
            buildVert(tetrahedron.p1, tetrahedron.p0, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel)
          ]

        case 0x0E:
          return [
            buildVert(tetrahedron.p0, tetrahedron.p1, isolevel),
            buildVert(tetrahedron.p0, tetrahedron.p2, isolevel),
            buildVert(tetrahedron.p0, tetrahedron.p3, isolevel)
          ];

        default:
          console.assert(false);
    }   
    return []; 
}

export function buildVert(
  point1: Point3DWithValue,
  point2: Point3DWithValue,
  isolevel: number): Point3D
{

    let valueOfPoint1 = point1.value;
    let valueOfPoint2 = point2.value;
    let x, y, z;

    if (valueOfPoint2 == valueOfPoint1) {
        x = (point1.x + point2.x) / 2.0;
        y = (point1.y + point2.y) / 2.0;
        z = (point1.z + point2.z) / 2.0;
    } else {
        let interpolation = (isolevel - valueOfPoint1) / (valueOfPoint2 - valueOfPoint1);
        let oneMinusInterpolation = 1 - interpolation;

        x = point1.x * oneMinusInterpolation + point2.x * interpolation;
        y = point1.y * oneMinusInterpolation + point2.y * interpolation;
        z = point1.z * oneMinusInterpolation + point2.z * interpolation;
    }
    return { x, y, z };
}

export type DensityValue = number;
export type DensityCubeSample = [
  DensityValue, DensityValue, DensityValue, DensityValue,
  DensityValue, DensityValue, DensityValue, DensityValue
];
export type CubeIndex = 0 | 1 | 2| 3 | 4| 5 | 6 | 7;

export type DensityTetrahedronSample = {
  p0: { value: DensityValue, cubeIndex: CubeIndex };
  p1: { value: DensityValue, cubeIndex: CubeIndex };
  p2: { value: DensityValue, cubeIndex: CubeIndex };
  p3: { value: DensityValue, cubeIndex: CubeIndex };
};

export function getTetrahedronSamplesFromCubeSample(cube: DensityCubeSample): DensityTetrahedronSample[] {
  const wrap = (d: DensityValue, index: CubeIndex) => {
    return { value: d, cubeIndex: index};
  } 
  const result: DensityTetrahedronSample[] = [
    { p0: wrap(cube[0], 0), p1: wrap(cube[7], 7), p2: wrap(cube[3], 3), p3: wrap(cube[2], 2) },
    { p0: wrap(cube[0], 0), p1: wrap(cube[7], 7), p2: wrap(cube[2], 2), p3: wrap(cube[6], 6) },
    { p0: wrap(cube[0], 0), p1: wrap(cube[4], 4), p2: wrap(cube[7], 7), p3: wrap(cube[6], 6) },
    { p0: wrap(cube[0], 0), p1: wrap(cube[1], 1), p2: wrap(cube[6], 6), p3: wrap(cube[2], 2) },
    { p0: wrap(cube[0], 0), p1: wrap(cube[4], 4), p2: wrap(cube[6], 6), p3: wrap(cube[1], 1) },
    { p0: wrap(cube[5], 5), p1: wrap(cube[1], 1), p2: wrap(cube[6], 6), p3: wrap(cube[4], 4) }
  ];
  return result;
}
