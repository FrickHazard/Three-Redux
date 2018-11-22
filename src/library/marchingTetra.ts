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

import { Point3D } from './basicDataTypes';
import { AABB } from './AABB';


interface Point3DWithValue extends Point3D {
 value: number;
};

interface Tetrahedron {
  p1: Point3DWithValue;
  p2: Point3DWithValue;
  p3: Point3DWithValue;
  p4: Point3DWithValue;
}

interface VolumeData {
  aabb: AABB;
  data: number[][][];
}

export function valueAt(volumeData: VolumeData, x: number, y: number, z: number) {
  if (
    x > volumeData.aabb.maxX || x < volumeData.aabb.minX,
    y > volumeData.aabb.maxY || y < volumeData.aabb.minY,
    z > volumeData.aabb.maxZ || z < volumeData.aabb.minZ,
  ) {
    console.assert(false);
  }
}


export function buildChunk (
  volumeData: VolumeData,
  resolution: number,
) {
  const grid : number[][][] = [];
  const xRange = bounding.maxX - bounding.minX;
  const yRange = bounding.maxY - bounding.minY;
  const zRange = bounding.maxZ - bounding.minZ;

  for (let i = 0; i < resolution; ++i) {
    let x1 = i / resolution * xRange + bounding.minX;
    let x2 = (i+1) / resolution * xRange + bounding.minX;
    for (let j = 0; j < resolution; ++j) {
        let y1 = j / resolution * yRange + bounding.minY;
        let y2 = (j+1) / resolution * yRange + bounding.minY;
        for (let k = 0; k < resolution; ++k) {
          let z1 = k / resolution * zRange + bounding.minZ;
          let z2 = (k+1) / resolution * zRange + bounding.minZ;

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
              { x: x1, y: y1, z: z1, value: volumeData[i    ][j    ][k    ]},
              { x: x2, y: y1, z: z1, value: volumeData[i + 1][j    ][k    ]},
              { x: x2, y: y2, z: z1, value: volumeData[i + 1][j + 1][k    ]},
              { x: x1, y: y2, z: z1, value: volumeData[i    ][j + 1][k    ]},
              { x: x1, y: y1, z: z2, value: volumeData[i    ][j    ][k + 1]},
              { x: x2, y: y1, z: z2, value: volumeData[i + 1][j    ][k + 1]},
              { x: x2, y: y2, z: z2, value: volumeData[i + 1][j + 1][k + 1]},
              { x: x1, y: y2, z: z2, value: volumeData[i    ][j + 1][k + 1]}
            ];

            const tetrahedra: Tetrahedron[] = [
              { p1: cubePoints[0], p2: cubePoints[7], p3: cubePoints[3], p4: cubePoints[2] },
              { p1: cubePoints[0], p2: cubePoints[7], p3: cubePoints[2], p4: cubePoints[6] },
              { p1: cubePoints[0], p2: cubePoints[4], p3: cubePoints[7], p4: cubePoints[6] },
              { p1: cubePoints[0], p2: cubePoints[1], p3: cubePoints[6], p4: cubePoints[2] },
              { p1: cubePoints[0], p2: cubePoints[4], p3: cubePoints[6], p4: cubePoints[1] },
              { p1: cubePoints[5], p2: cubePoints[1], p3: cubePoints[6], p4: cubePoints[4] }
            ];

        for (let t = 0; t < 6; ++t) {
          buildTetrahedron(tetrahedra[t]);
        }
      }
    }
  }   
};

export function buildTetrahedron(tetrahedron: Tetrahedron, isolevel = Infinity) {

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
    if (tetrahedron.p1.value < isolevel)
    index |= (1 << 0);
    if (tetrahedron.p2.value < isolevel)
    index |= (1 << 1);
    if (tetrahedron.p3.value < isolevel)
    index |= (1 << 2);
    if (tetrahedron.p4.value < isolevel)
    index |= (1 << 3);

    switch (index) {

        // we don't do anything if everyone is inside or outside
        case 0x00:
        case 0x0F:
            break;

        // only vert 0 is inside
        case 0x01:
            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel);
            buildVert(tetrahedron.p1, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel);
            break;

        // only vert 1 is inside
        case 0x02:
            buildVert(tetrahedron.p2, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);
            break;

        // only vert 2 is inside
        case 0x04:
            buildVert(tetrahedron.p3, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p2, isolevel);
            break;

        // only vert 3 is inside
        case 0x08:
            buildVert(tetrahedron.p4, tetrahedron.p2, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p1, isolevel);
            break;

        // verts 0, 1 are inside
        case 0x03:
            buildVert(tetrahedron.p4, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);

            buildVert(tetrahedron.p3, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p2, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);
            break;

        // verts 0, 2 are inside
        case 0x05:
            buildVert(tetrahedron.p4, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p1, isolevel);

            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p4, isolevel);
            break;

        // verts 0, 3 are inside
        case 0x09:
            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel);

            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel);
            break;

        // verts 1, 2 are inside
        case 0x06:
            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel);
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);

            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p3, isolevel);
            break;

        // verts 2, 3 are inside
        case 0x0C:
            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p1, isolevel);

            buildVert(tetrahedron.p3, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p2, isolevel);
            break;

        // verts 1, 3 are inside
        case 0x0A:
            buildVert(tetrahedron.p4, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel);

            buildVert(tetrahedron.p2,tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p1, isolevel);
            break;

        // verts 0, 1, 2 are inside
        case 0x07:
            buildVert(tetrahedron.p4, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p4, tetrahedron.p2, isolevel);
            break;

        // verts 0, 1, 3 are inside
        case 0x0B:
            buildVert(tetrahedron.p3, tetrahedron.p2, isolevel);
            buildVert(tetrahedron.p3,tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p3, tetrahedron.p1, isolevel);
            break;

        // verts 0, 2, 3 are inside
        case 0x0D:
            buildVert(tetrahedron.p2, tetrahedron.p1, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p4, isolevel);
            buildVert(tetrahedron.p2, tetrahedron.p3, isolevel);
            break;

        // verts 1, 2, 3 are inside
        case 0x0E:
            buildVert(tetrahedron.p1, tetrahedron.p2, isolevel);
            buildVert(tetrahedron.p1, tetrahedron.p3, isolevel);
            buildVert(tetrahedron.p1, tetrahedron.p4, isolevel);
            break;

        default:
          console.assert(false);
    }    
}

export function buildVert(p1: Point3DWithValue, p2: Point3DWithValue, isolevel = Infinity)
{

    let v1 = p1.value;
    let v2 = p2.value;
    let x, y, z;

    if (v2 == v1) {
        x = (p1.x + p2.x) / 2.0;
        y = (p1.y + p2.y) / 2.0;
        z = (p1.z + p2.z) / 2.0;
    } else {
        let interpolation = (isolevel - v1) / (v2 - v1);
        let oneMinusInterpolation = 1 - interpolation;

        x = p1.x * oneMinusInterpolation + p2.x * interpolation;
        y = p1.y * oneMinusInterpolation + p2.y * interpolation;
        z = p1.z * oneMinusInterpolation + p2.z * interpolation;
    }

    const normal = surface.gradientAt(x, y, z);
    const position = { x, y, z };
}

export function getGradient(){
    const epsilon = 0.0001;

    const dx = valueAt(x + epsilon, y, z) - valueAt(x - epsilon, y, z);
    const dy = valueAt(x, y + epsilon, z) - valueAt(x, y - epsilon, z);
    const dz = valueAt(x, y, z + epsilon) - valueAt(x, y, z - epsilon);

    const result = normalize({ x: dx, y: dy, z: dz });
    return result;
}

function normalize(vector: Point3D): Point3D {
  const result = { ...vector };
  const l = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  console.assert(l > 0);
  result.x /= l;
  result.y /= l;
  result.z /= l;
  return result;
}
