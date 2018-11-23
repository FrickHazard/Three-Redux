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

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function lerp(a: number, b: number, t: number) {
  return ((b - a) * clamp01(t)) + a;
}

function inverseLerp(a: number, b: number, c: number) {
  return (Math.min(Math.max(c, a), b) - a) / (b - a);
}

function valueAt(volumeData: VolumeData, x: number, y: number, z: number): number {
  let xPercentage = inverseLerp(volumeData.aabb.minX, volumeData.aabb.maxX, x);
  let yPercentage = inverseLerp(volumeData.aabb.minY, volumeData.aabb.maxY, y);
  let zPercentage = inverseLerp(volumeData.aabb.minZ, volumeData.aabb.maxZ, z);

  let leftNodeIndex = Math.floor(xPercentage * (volumeData.data.length - 1)) - 1;
  if (leftNodeIndex === -1) leftNodeIndex ++;
  let rightNodeIndex = leftNodeIndex + 1;
  let downNodeIndex = Math.floor(yPercentage * (volumeData.data[0].length - 1)) - 1;
  if (downNodeIndex === -1) downNodeIndex ++;
  let upNodeIndex = downNodeIndex + 1;
  let backNodeIndex = Math.floor(zPercentage * (volumeData.data[0][0].length - 1)) - 1;
  if (backNodeIndex === -1) backNodeIndex ++;
  let forwardNodeIndex = backNodeIndex + 1;

  const LeftUpFowardValue = volumeData.data[leftNodeIndex ][upNodeIndex  ][forwardNodeIndex];
  const rightUpForwardValue = volumeData.data[rightNodeIndex][upNodeIndex  ][forwardNodeIndex];
  const leftDownFowardValue = volumeData.data[leftNodeIndex ][downNodeIndex][forwardNodeIndex];
  const rightDownForwardValue = volumeData.data[rightNodeIndex][downNodeIndex][forwardNodeIndex];
  const leftUpBackValue = volumeData.data[leftNodeIndex ][upNodeIndex  ][backNodeIndex   ];
  const rightUpBackValue = volumeData.data[rightNodeIndex][upNodeIndex  ][backNodeIndex   ];
  const leftDownBackValue = volumeData.data[leftNodeIndex ][downNodeIndex][backNodeIndex   ];
  const rightDownBackValue = volumeData.data[rightNodeIndex][downNodeIndex][backNodeIndex   ];

  function getIndexCenterPercentage(index: number, length: number){
    return ((index + 1) / length) - ((1 / length) * 0.5);
  }

  const xSamplePercentage = inverseLerp(
    getIndexCenterPercentage(leftNodeIndex, volumeData.data.length),
    getIndexCenterPercentage(rightNodeIndex, volumeData.data.length), xPercentage);
  const ySamplePercentage = inverseLerp(
    getIndexCenterPercentage(downNodeIndex, volumeData.data[0].length),
    getIndexCenterPercentage(upNodeIndex, volumeData.data[0].length), yPercentage);
  const zSamplePercentage = inverseLerp(
    getIndexCenterPercentage(backNodeIndex, volumeData.data[0][0].length),
    getIndexCenterPercentage(forwardNodeIndex, volumeData.data[0][0].length), zPercentage);

  const downForwardValue = lerp(leftDownFowardValue, rightDownForwardValue, xSamplePercentage);
  const upForwardValue = lerp(LeftUpFowardValue, rightUpForwardValue, xSamplePercentage);
  const downBackValue = lerp(leftDownBackValue, rightDownBackValue, xSamplePercentage);
  const upBackValue = lerp(leftUpBackValue, rightUpBackValue, xSamplePercentage);

  const forwardValue = lerp(downForwardValue, upForwardValue, ySamplePercentage);
  const backValue = lerp(downBackValue, upBackValue, ySamplePercentage);

  return lerp(backValue, forwardValue, zSamplePercentage);
}


export function buildChunk (
  volumeData: VolumeData,
  resolution: number,
  isolevel: number,
): Geometry {
  const grid : number[][][] = [];
  const xRange = volumeData.aabb.maxX - volumeData.aabb.minX;
  const yRange = volumeData.aabb.maxY - volumeData.aabb.minY;
  const zRange = volumeData.aabb.maxZ - volumeData.aabb.minZ;

  for (let i = 0; i <= resolution; ++i) {
    let x = i/resolution * xRange + volumeData.aabb.minX;
    grid.push([]);
    for (let j = 0; j <= resolution; ++j) {
        grid[i].push([]);
        let y = j / resolution * yRange + volumeData.aabb.minY;
        for (let k = 0; k <= resolution; ++k) {
            let z = k/resolution * zRange + volumeData.aabb.minZ;
            let value = valueAt(volumeData, x, y, z);
            grid[i][j][k] = value;
        }
    }
  }

  let verticeData: { position: Point3D, normal: Point3D }[] = [];

  for (let i = 0; i < resolution; ++i) {
    let x1 = i / resolution * xRange + volumeData.aabb.minX;
    let x2 = (i+1) / resolution * xRange + volumeData.aabb.minX;
    for (let j = 0; j < resolution; ++j) {
        let y1 = j / resolution * yRange + volumeData.aabb.minY;
        let y2 = (j+1) / resolution * yRange + volumeData.aabb.minY;
        for (let k = 0; k < resolution; ++k) {
          let z1 = k / resolution * zRange + volumeData.aabb.minZ;
          let z2 = (k+1) / resolution * zRange + volumeData.aabb.minZ;

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
              { p1: cubePoints[0], p2: cubePoints[7], p3: cubePoints[3], p4: cubePoints[2] },
              { p1: cubePoints[0], p2: cubePoints[7], p3: cubePoints[2], p4: cubePoints[6] },
              { p1: cubePoints[0], p2: cubePoints[4], p3: cubePoints[7], p4: cubePoints[6] },
              { p1: cubePoints[0], p2: cubePoints[1], p3: cubePoints[6], p4: cubePoints[2] },
              { p1: cubePoints[0], p2: cubePoints[4], p3: cubePoints[6], p4: cubePoints[1] },
              { p1: cubePoints[5], p2: cubePoints[1], p3: cubePoints[6], p4: cubePoints[4] }
            ];

        for (let t = 0; t < 6; t++) {
          verticeData = verticeData.concat(buildTetrahedron(volumeData, tetrahedra[t], isolevel));
        }
      }
    }
  }
  const geometry = new Geometry();
  geometry.vertices = verticeData.map(data =>
    new Vector3(data.position.x, data.position.y, data.position.z));
  const faces: Face3[] = [];
  for (let i = 0; i < (verticeData.length / 3); i++) {
    faces.push(new Face3((i * 3) + 0,(i * 3) + 1 ,(i * 3) + 2));
  }  
  geometry.computeFaceNormals();
  geometry.computeBoundingSphere();
  geometry.faces = faces;
  return geometry;
};

export function buildTetrahedron(
  volumeData: VolumeData,
  tetrahedron: Tetrahedron,
  isolevel: number,
): { position: Point3D, normal: Point3D }[]{

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
            return [];

        // only vert 0 is inside
        case 0x01:
          return [
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p2, isolevel),
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p3, isolevel)
          ];

        // only vert 1 is inside
        case 0x02:
          return [
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel)
          ];

        // only vert 2 is inside
        case 0x04:
          return [
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p2, isolevel)
          ];

        // only vert 3 is inside
        case 0x08:
          return [
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p2, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p1, isolevel)
          ];

        // verts 0, 1 are inside
        case 0x03:
          return [
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel),

            buildVert(volumeData, tetrahedron.p3, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p2, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel)
          ];

        // verts 0, 2 are inside
        case 0x05:
          return [
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p1, isolevel),

            buildVert(volumeData, tetrahedron.p2, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p4, isolevel)
          ];

        // verts 0, 3 are inside
        case 0x09:
          return [
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p2, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p3, isolevel),

            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p3, isolevel)
          ]

        // verts 1, 2 are inside
        case 0x06:
          return [
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p2, isolevel),
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel),

            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p3, isolevel)
          ]

        // verts 2, 3 are inside
        case 0x0C:
          return [
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p1, isolevel),

            buildVert(volumeData, tetrahedron.p3, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p2, isolevel)
          ];

        // verts 1, 3 are inside
        case 0x0A:
          return [
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p3, isolevel),

            buildVert(volumeData, tetrahedron.p2, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p1, isolevel),
          ];

        // verts 0, 1, 2 are inside
        case 0x07:
          return [
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p4, tetrahedron.p2, isolevel),
          ];

        // verts 0, 1, 3 are inside
        case 0x0B:
          return [
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p2, isolevel),
            buildVert(volumeData, tetrahedron.p3,tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p3, tetrahedron.p1, isolevel)
          ];

        // verts 0, 2, 3 are inside
        case 0x0D:
          return [
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p1, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p4, isolevel),
            buildVert(volumeData, tetrahedron.p2, tetrahedron.p3, isolevel)
          ]

        // verts 1, 2, 3 are inside
        case 0x0E:
          return [
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p2, isolevel),
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p3, isolevel),
            buildVert(volumeData, tetrahedron.p1, tetrahedron.p4, isolevel)
          ];

        default:
          console.assert(false);
    }   
    return []; 
}

export function buildVert(
  volumeData: VolumeData,
  p1: Point3DWithValue,
  p2: Point3DWithValue,
  isolevel: number): { position: Point3D, normal: Point3D }
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

    const normal = getGradient(volumeData, x, y, z);
    const position = { x, y, z };
    return { position, normal };
}

export function getGradient(volumeData: VolumeData, x: number, y: number, z: number){
    const epsilon = 0.0001;

    const dx = valueAt(volumeData, x + epsilon, y, z) - valueAt(volumeData, x - epsilon, y, z);
    const dy = valueAt(volumeData, x, y + epsilon, z) - valueAt(volumeData, x, y - epsilon, z);
    const dz = valueAt(volumeData, x, y, z + epsilon) - valueAt(volumeData, x, y, z - epsilon);

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
 