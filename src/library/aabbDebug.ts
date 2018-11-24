import { Geometry, Vector3 } from 'three';
import { AABB } from './AABB';

export function createAABBGeometry (aabb: AABB, resolution: number): Geometry {
  const xRange = aabb.maxX - aabb.minX;
  const yRange = aabb.maxY - aabb.minY;
  const zRange = aabb.maxZ - aabb.minZ;
  const pointGrid: Vector3[][][] = [];
  for (let i = 0; i <= resolution; ++i) {
    pointGrid.push([]);
    let x = i / resolution * xRange + aabb.minX;
    for (let j = 0; j <= resolution; ++j) {
      pointGrid[i].push([]);
        let y = j / resolution * yRange + aabb.minY;
        for (let k = 0; k <= resolution; ++k) {
            let z = k / resolution * zRange + aabb.minZ;
            pointGrid[i][j][k] = new Vector3(x, y, z);
        }
    }
  }
  const verts: Vector3[] = [];
  for (let i = 0; i < resolution; ++i) {
    for (let j = 0; j < resolution; ++j) {
      for (let k = 0; k < resolution; ++k) {
        // x lines
        verts.push(pointGrid[i    ][j][k]);
        verts.push(pointGrid[i + 1][j][k]);

        verts.push(pointGrid[i    ][j][k + 1]);
        verts.push(pointGrid[i + 1][j][k + 1]);

        verts.push(pointGrid[i    ][j + 1][k]);
        verts.push(pointGrid[i + 1][j + 1][k]);

        verts.push(pointGrid[i    ][j + 1][k + 1]);
        verts.push(pointGrid[i + 1][j + 1][k + 1]);
        // y lines
        verts.push(pointGrid[i][j    ][k]);
        verts.push(pointGrid[i][j + 1][k]);

        verts.push(pointGrid[i][j    ][k + 1]);
        verts.push(pointGrid[i][j + 1][k + 1]);

        verts.push(pointGrid[i + 1][j    ][k]);
        verts.push(pointGrid[i + 1][j + 1][k]);

        verts.push(pointGrid[i + 1][j    ][k + 1]);
        verts.push(pointGrid[i + 1][j + 1][k + 1]);

        // z lines
        verts.push(pointGrid[i][j][k    ]);
        verts.push(pointGrid[i][j][k + 1]);

        verts.push(pointGrid[i][j + 1][k    ]);
        verts.push(pointGrid[i][j + 1][k + 1]);

        verts.push(pointGrid[i + 1][j][k    ]);
        verts.push(pointGrid[i + 1][j][k + 1]);

        verts.push(pointGrid[i + 1][j + 1][k    ]);
        verts.push(pointGrid[i + 1][j + 1][k + 1]);
      }
    }
  }
  const geometry = new Geometry();
  geometry.vertices = verts;
  return geometry;
}