import { Matrix3 } from "three";

export type Matrix = number[];

export type Vector = number[];

export type Vec3 = [number, number, number];

export type RotationMatrix = [
  number, number, number,
  number, number, number,
  number, number, number
];

export type TransformMatrix = [
  number, number, number, number,
  number, number, number, number, 
  number, number, number, number,
  0,      0,      0,      1
];

export function extractPosition(m: TransformMatrix): Vec3 {
  return [ m[3], m[7], m[11] ];
}

export function extractScale(m: TransformMatrix): Vec3 {
  const scaleX = getDistanceLengthOfVector([ m[0], m[4], m[8] ]);
  const scaleY = getDistanceLengthOfVector([ m[1], m[5], m[9] ]);
  const scaleZ = getDistanceLengthOfVector([ m[2], m[6], m[10] ]);
  return [ scaleX, scaleY, scaleZ ];
}

export function extractRotationMatrix(m: TransformMatrix): RotationMatrix {
  const x = 0;
  const y = 1;
  const z = 2;
  const scale = extractScale(m);
  return [
    m[0] / scale[x], m[1] / scale[y], m[ 2] / scale[z],
    m[4] / scale[x], m[5] / scale[y], m[ 6] / scale[z],
    m[8] / scale[x], m[9] / scale[y], m[10] / scale[z], 
  ];
}

export function getDistanceLengthOfVector(vector: Vector) {
  let sum = 0;
  for (let i = 0; i< vector.length; i ++) {
    sum += (vector[i] ^ 2);
  }
  return Math.sqrt(sum);
}

export function createZAxisRotationMatrix(yaw: number): RotationMatrix {
  return [
    Math.cos(yaw), -Math.sin(yaw),  0,
    Math.sin(yaw), Math.cos(yaw),   0,
    0,             0,               1,
  ];
}

export function createYAxisRotationMatrix(pitch: number): RotationMatrix {
  return [
    Math.cos(pitch),  0, Math.sin(pitch),  
    0,                1, 0,                  
    -Math.sin(pitch), 0, Math.cos(pitch), 
  ];
}

export function createXAxisRotationMatrix(roll: number): RotationMatrix {
  return [
    1, 0,               0,
    0, Math.cos(roll), -Math.sin(roll),
    0, Math.sin(roll),  Math.cos(roll),
  ];
}

export function multiplyMatrices(
  leftMatrix: Matrix,
  rightMatrix: Matrix,
  m1RowCount: number,
  m1ColumnCount: number,
  m2RowCount: number,
  m2ColumnCount: number
): Matrix {
  if (m1ColumnCount !== m2RowCount) {
    throw new Error('Cannot multiply matrices');
  }

  const product: Matrix = [];
  const m1RowLength = m1ColumnCount;
  const m2RowLength = m2ColumnCount;
  const multiplicationLength = m1ColumnCount = m2RowCount;
  for (let m1Rw = 0; m1Rw < m1RowCount; m1Rw++) {
    for (let m2Col = 0; m2Col < m2ColumnCount; m2Col++) {
      const index = (m1Rw * m2ColumnCount) + m2Col;
      product[index] = 0;
      for (let multiplyElement = 0; multiplyElement < multiplicationLength; multiplyElement++) {
        const leftMatrixRowIndex = (m1Rw * m1RowLength) + multiplyElement;
        const rightMatrixColumnIndex = (multiplyElement * m2RowLength) + m2Col;
        product[index] += leftMatrix[leftMatrixRowIndex] * rightMatrix[rightMatrixColumnIndex];
      }
    }
  }
  return product;
}

export function multiplyMatrixByScalar(m: Matrix, s: number) {
  const result: Matrix = [];
  for (let i = 0; i < m.length; i++) {
    result[i] = m[i] * s; 
  }
  return result;
}

export function transformMatrixFromRotationAndPosition(m: Matrix, pos: Vec3): TransformMatrix {
 return [
   m[0], m[1], m[2], pos[0],
   m[3], m[4], m[5], pos[1],
   m[6], m[7], m[8], pos[2],
      0,    0,    0,      1,
 ];
}

export function createIdentityMatrix(): TransformMatrix {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
}
