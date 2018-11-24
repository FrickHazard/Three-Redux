import { Point3D } from './basicDataTypes';
import { AABB, isPointInsideAABB }  from './AABB';
import { ScalarField } from './ScalarField';

type VoxelValue = 1 | 0; 
export function createVoxelScalarField(
  center: Point3D,
  voxelSize: number,
  data: VoxelValue[][][]
): ScalarField {
  const halfSize = (data.length * voxelSize) / 2;
  const bounding: AABB = {
    minX: center.x - halfSize,
    minY: center.y - halfSize,
    minZ: center.z - halfSize,
    maxX: center.x + halfSize,
    maxY: center.y + halfSize,
    maxZ: center.z + halfSize,
  };
  return {
    valueAt: function(x: number, y: number, z: number): VoxelValue {
      if (!isPointInsideAABB({ x, y, z }, bounding)) return 0;
      let leftDistance = (x - bounding.minX) / (voxelSize);
      let downDistance = (y - bounding.minY) / (voxelSize);
      let backDistance = (z - bounding.minZ) / (voxelSize);

      let leftNodeIndex = Math.floor(leftDistance) -1;
      let downNodeIndex = Math.floor(downDistance) -1;
      let backNodeIndex = Math.floor(backDistance) -1;
      let onXEdge = Number.isInteger(leftDistance) && leftNodeIndex !== data.length - 1;
      let onYEdge = Number.isInteger(downDistance) && downNodeIndex !== data[0].length - 1;
      let onZEdge = Number.isInteger(backDistance) && backNodeIndex !== data[0][0].length - 1;

      if (leftNodeIndex === -1) {
        leftNodeIndex ++;
        onXEdge = false
      }
      if (downNodeIndex === -1) {
        downNodeIndex ++;
        onYEdge = false;
      }
      if (backNodeIndex === -1) {
        backNodeIndex ++;
        onZEdge = false;
      }
      let rightNodeIndex = leftNodeIndex === (data.length - 1) ? leftNodeIndex: leftNodeIndex + 1;
      let upNodeIndex = downNodeIndex === (data[0].length - 1) ? downNodeIndex : downNodeIndex + 1;
      let forwardNodeIndex = backNodeIndex === (data[0][0].length - 1) ? backNodeIndex : backNodeIndex + 1;

      const leftDownBackValue = data[leftNodeIndex][downNodeIndex][backNodeIndex];
      const leftDownForwardValue = data[leftNodeIndex][downNodeIndex][forwardNodeIndex];
      const leftUpBackValue = data[leftNodeIndex][upNodeIndex][backNodeIndex];
      const leftUpForwardValue = data[leftNodeIndex][upNodeIndex][forwardNodeIndex];
      const rightDownBackValue = data[rightNodeIndex][downNodeIndex][backNodeIndex];
      const rightDownForwardValue = data[rightNodeIndex][downNodeIndex][forwardNodeIndex];
      const rightUpBackValue = data[rightNodeIndex][upNodeIndex][backNodeIndex];
      const rightUpForwardValue = data[rightNodeIndex][upNodeIndex][forwardNodeIndex];


      if (leftDownBackValue) return 1;
      if (onXEdge) {
        if (rightDownBackValue) return 1;
      }
      if (onYEdge) {
        if (leftUpBackValue) return 1;
        if (onXEdge) {
          if (rightUpBackValue) return 1;
        }
      }
      if (onZEdge) {
        if (leftDownForwardValue) return 1;
        if (onXEdge) {
          if (rightDownForwardValue) return 1;
        }
        if (onYEdge) {
          if (leftUpForwardValue) return 1;
          if (onXEdge) {
            if(rightUpForwardValue) return 1;
          }
        }
      }
      return 0;
    },
    gradientAt: function() { return 1; }

  };
}
