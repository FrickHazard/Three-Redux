import { AABB } from './AABB';
import { ScalarField } from './ScalarField';
import { createSphereScalarField } from './sphereScalarField';
import { Point3D } from './basicDataTypes';
import { Face3, Geometry, Mesh, Vector3, MeshBasicMaterial } from 'three';
import { flatten } from 'lodash';

function adapt(v0: number, v1: number) {
  return (0 - v0) / (v1 - v0);
  // return 0.5;
}

function dualContour ( 
  scalarField: ScalarField,
  aabb: AABB,
): Geometry {
  const vertArray: Point3D[] = []
  const vertIndices: number[][][] = [];
  const quads: number[][] = [];
  for (let x = aabb.minX; x < aabb.maxX; x++) {
    const xIndex = x - aabb.minX;
    vertIndices.push([]);
    for (let y = aabb.minY; y < aabb.maxY; y++) {
      const yIndex = y - aabb.minY;
      vertIndices[xIndex].push([]);
      for (let z = aabb.minZ; z < aabb.maxZ; z++) {
        const zIndex = z - aabb.minZ;
        const vert = dual_contour_3d_find_best_vertex(scalarField, x, y, z)
        if (vert === null) continue;
        vertArray.push(vert);
        vertIndices[xIndex][yIndex][zIndex] = vertArray.length - 1;
      }
    }
  }
  for (let x = aabb.minX; x < aabb.maxX; x++) {
    const xIndex = x - aabb.minX;
    for (let y = aabb.minY; y < aabb.maxY; y++) {
      const yIndex = y - aabb.minY;
      for (let z = aabb.minZ; z < aabb.maxZ; z++) {
        const zIndex = z - aabb.minZ;
        if (x > aabb.minX && y > aabb.minY) {
          const solid1 = scalarField.valueAt(x, y, z + 0) > 0;
          const solid2 = scalarField.valueAt(x, y, z + 1) > 0;
          if (solid1 !== solid2) {
            let quad = [
              vertIndices[xIndex - 1][yIndex - 1][zIndex],
              vertIndices[xIndex - 0][yIndex - 1][zIndex],
              vertIndices[xIndex - 0][yIndex - 0][zIndex],
              vertIndices[xIndex - 1][yIndex - 0][zIndex]
            ];
            if (solid2) {
              quad = quad.reverse();
            }
            quads.push(quad);
          }
        }
        if (x > aabb.minX && z > aabb.minZ) {
          const solid1 = scalarField.valueAt(x, y + 0, z) > 0;
          const solid2 = scalarField.valueAt(x, y + 1, z) > 0;
          if (solid1 !== solid2) {
            let quad = [
              vertIndices[xIndex - 1][yIndex][zIndex - 1],
              vertIndices[xIndex - 0][yIndex][zIndex - 1],
              vertIndices[xIndex - 0][yIndex][zIndex - 0],
              vertIndices[xIndex - 1][yIndex][zIndex - 0]
            ];
            if (solid1) {
              quad = quad.reverse();
            }
            quads.push(quad);
          }
        }
        if (y > aabb.minY && z > aabb.minZ) {
          const solid1 = scalarField.valueAt(x + 0, y, z) > 0;
          const solid2 = scalarField.valueAt(x + 1, y, z) > 0;
          if (solid1 !== solid2) {
            let quad = [
              vertIndices[xIndex][yIndex - 1][zIndex - 1],
              vertIndices[xIndex][yIndex - 0][zIndex - 1],
              vertIndices[xIndex][yIndex - 0][zIndex - 0],
              vertIndices[xIndex][yIndex - 1][zIndex - 0],
            ];
            if (solid2) {
              quad = quad.reverse();
            }
            quads.push(quad);
          }
        }
      }
    }
  }
  const faces = flatten(quads.map(quad => {
    return [
      new Face3(quad[0], quad[1], quad[2]),
      new Face3(quad[0], quad[2], quad[3])
    ];
  }));
  const geometry = new Geometry();
  geometry.faces = faces;
  geometry.vertices = vertArray.map(vert => new Vector3(vert.x, vert.y, vert.z));
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere(); 
  return geometry;
}
  
function dual_contour_3d_find_best_vertex(
  scalarField: ScalarField,
  x: number, y: number, z: number
): Point3D | null {
    // if not ADAPTIVE:
    //     return V3(x+0.5, y+0.5, z+0.5)

    // # Evaluate f at each corner
    const vertValues: number[][][] = [[[], []], [[], []]];
    // v = np.empty((2, 2, 2))
    for (let xCubeIndex = 0; xCubeIndex < 2; xCubeIndex++) {
      for (let yCubeIndex = 0; yCubeIndex < 2; yCubeIndex++) {
        for (let zCubeIndex = 0; zCubeIndex < 2; zCubeIndex++) {
          vertValues[xCubeIndex][yCubeIndex][zCubeIndex] =
            scalarField.valueAt(x + xCubeIndex, y + yCubeIndex, z + zCubeIndex);
        }
      }
    }

    const changes: Point3D[] = [];

    for (let edgeXIndex = 0; edgeXIndex < 2; edgeXIndex ++) {
      for (let edgeYIndex = 0; edgeYIndex < 2; edgeYIndex ++) {
        // iso check instead of 0
        if (vertValues[edgeXIndex][edgeYIndex][0] > 0 !==
            vertValues[edgeXIndex][edgeYIndex][1] > 0) {
            changes.push(({
              x: x + edgeXIndex,
              y: y + edgeYIndex,
              // linearly interpolate to iso level
              z: z + adapt(
                vertValues[edgeXIndex][edgeYIndex][0],
                vertValues[edgeXIndex][edgeYIndex][1]) 
            }));
        }
      }
    }

    for (let edgeXIndex = 0; edgeXIndex < 2; edgeXIndex ++) {
      for (let edgeZIndex = 0; edgeZIndex < 2; edgeZIndex ++) {
        // iso check instead of 0
        if (vertValues[edgeXIndex][0][edgeZIndex] > 0 !==
            vertValues[edgeXIndex][1][edgeZIndex] > 0) {
            changes.push(({
              x: x + edgeXIndex,
              y: y + adapt(
                vertValues[edgeXIndex][0][edgeZIndex],
                vertValues[edgeXIndex][1][edgeZIndex]),
              // linearly interpolate to iso level
              z: z + edgeZIndex 
            }));
        }
      }
    }
    for (let edgeYIndex = 0; edgeYIndex < 2; edgeYIndex ++) {
      for (let edgeZIndex = 0; edgeZIndex < 2; edgeZIndex ++) {
        // iso check instead of 0
        if (vertValues[0][edgeYIndex][edgeZIndex] > 0 !==
            vertValues[1][edgeYIndex][edgeZIndex] > 0) {
            changes.push(({
              x: x + + adapt(
                vertValues[0][edgeYIndex][edgeZIndex],
                vertValues[1][edgeYIndex][edgeZIndex]),
              y: y + edgeYIndex,
              // linearly interpolate to iso level
              z: z + edgeZIndex 
            }));
        }
      }
    }

    if (changes.length === 0) return null

    const normals: Point3D[] = [];
    for (const v of changes) {
        const n = scalarField.gradientAt(v.x, v.y, v.z)
        normals.push(n)
    }

    return solveLeastSquares(changes, normals)
}

// function solve_qef_3d(positions: Point3D[], normals: Point3D[]): Point3D {
//   return solveLeastSquares(positions, normals)

//   // v[0] = numpy.clip(v[0], x, x + 1)
//   // v[1] = numpy.clip(v[1], y, y + 1)
//   // v[2] = numpy.clip(v[2], z, z + 1)

//   // return V3(v[0], v[1], v[2])
// }

type Matrix = number[][];
type Vector = number [];

function solveLeastSquares(positions: Point3D[], normals: Point3D[]): Point3D {
  const A: Matrix = [];
  const b: Vector = [];
  for (let i = 0; i < 3; i++) {
    if (i < positions.length) {
      A.push([ normals[i].x, normals[i].y, normals[i].z ]);
      b[i] = (positions[i].x * normals[i].x) +
             (positions[i].y * normals[i].y) +
             (positions[i].z * normals[i].z);
    } else {
      A.push([0, 0, 0]);
      b[i] = 0;
    }
  }

  // AT * A * xˆ = AT * b
  const AT = transposeMatrix(A);
  const ATA = multiplyMatrices(AT, A);
  const ATB = multiplyMatrices(AT, vectorToMatrix(b));
  const ATAINV = matrixInverse(ATA);
  let x: Matrix;
  if (ATAINV) {
    x = multiplyMatrices(ATAINV, ATB);
  } else {
    x = [
      [positions.map(p => p.x).reduce((p, c) => p + c) / positions.length],
      [positions.map(p => p.y).reduce((p, c) => p + c) / positions.length],
      [positions.map(p => p.z).reduce((p, c) => p + c) / positions.length]
    ];
  }

  return { x: x[0][0], y: x[1][0], z: x[2][0] };
  
}

function vectorToMatrix(v: Vector):Matrix {
  // column order
  return [...v.map(x => [x])];
}

function transposeMatrix(m: Matrix){
  return m[0].map((x, i) => m.map(x => x[i]))
}

function multiplyMatrices(m1: Matrix, m2: Matrix): Matrix {
  const result: Matrix = [];
  for (let i = 0; i < m1.length; i++) {
    result[i] = [];
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0;
      for (var k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

// Returns the inverse of matrix `M`.
function matrixInverse(m: Matrix): Matrix | undefined {
  // I use Guassian Elimination to calculate the inverse:
  // (1) 'augment' the matrix (left) by the identity (on the right)
  // (2) Turn the matrix on the left into the identity by elemetry row ops
  // (3) The matrix on the right is the inverse (was the identity matrix)
  // There are 3 elemtary row ops: (I combine b and c in my code)
  // (a) Swap 2 rows
  // (b) Multiply a row by a scalar
  // (c) Add 2 rows
  
  //if the matrix isn't square: exit (error)
  if(m.length !== m[0].length){return;}
  
  //create the identity matrix (I), and a copy (C) of the original
  let i = 0, ii = 0, j = 0, dimension = m.length, e = 0;
  let inverseMatrix: number[][] = [], identityMatrix: number[][] = [];
  for(i = 0; i < dimension; i+=1){
      // Create the row
      inverseMatrix[inverseMatrix.length]=[];
      identityMatrix[identityMatrix.length]=[];
      for(j = 0; j < dimension; j += 1){
          
          //if we're on the diagonal, put a 1 (for identity)
          if(i==j){ inverseMatrix[i][j] = 1; }
          else{ inverseMatrix[i][j] = 0; }
          
          // Also, make the copy of the original
          identityMatrix[i][j] = m[i][j];
      }
  }
  
  // Perform elementary row operations
  for(i=0; i<dimension; i+=1){
      // get the element e on the diagonal
      e = identityMatrix[i][i];
      
      // if we have a 0 on the diagonal (we'll need to swap with a lower row)
      if(e==0){
          //look through every row below the i'th row
          for(ii=i+1; ii<dimension; ii+=1){
              //if the ii'th row has a non-0 in the i'th col
              if(identityMatrix[ii][i] != 0){
                  //it would make the diagonal have a non-0 so swap it
                  for(j=0; j<dimension; j++){
                      e = identityMatrix[i][j];       //temp store i'th row
                      identityMatrix[i][j] = identityMatrix[ii][j];//replace i'th row by ii'th
                      identityMatrix[ii][j] = e;      //repace ii'th by temp
                      e = inverseMatrix[i][j];       //temp store i'th row
                      inverseMatrix[i][j] = inverseMatrix[ii][j];//replace i'th row by ii'th
                      inverseMatrix[ii][j] = e;      //repace ii'th by temp
                  }
                  //don't bother checking other rows since we've swapped
                  break;
              }
          }
          //get the new diagonal
          e = identityMatrix[i][i];
          //if it's still 0, not invertable (error)
          if(e==0){return}
      }
      
      // Scale this row down by e (so we have a 1 on the diagonal)
      for(j=0; j<dimension; j++){
          identityMatrix[i][j] = identityMatrix[i][j]/e; //apply to original matrix
          inverseMatrix[i][j] = inverseMatrix[i][j]/e; //apply to identity
      }
      
      // Subtract this row (scaled appropriately for each row) from ALL of
      // the other rows so that there will be 0's in this column in the
      // rows above and below this one
      for(ii=0; ii<dimension; ii++){
          // Only apply to other rows (we want a 1 on the diagonal)
          if(ii==i){continue;}
          
          // We want to change this element to 0
          e = identityMatrix[ii][i];
          
          // Subtract (the row above(or below) scaled by e) from (the
          // current row) but start at the i'th column and assume all the
          // stuff left of diagonal is 0 (which it should be if we made this
          // algorithm correctly)
          for(j=0; j<dimension; j++){
              identityMatrix[ii][j] -= e*identityMatrix[i][j]; //apply to original matrix
              inverseMatrix[ii][j] -= e*inverseMatrix[i][j]; //apply to identity
          }
      }
  }
  return inverseMatrix;
}

export function test(): Mesh {
  const field = createSphereScalarField(3);
  const geometry = dualContour(field, {
    maxX:  8, maxY:  8, maxZ:  8,
    minX: -8, minY: -8, minZ: -8
  });
  return new Mesh(geometry, new MeshBasicMaterial({ wireframe: true }));
}