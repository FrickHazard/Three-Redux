import { Point3D } from './basicDataTypes';

// https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
};

export function isPointInsideAABB(point: Point3D, box: AABB) {
  return (point.x >= box.minX && point.x <= box.maxX) &&
    (point.y >= box.minY && point.y <= box.maxY) &&
    (point.z >= box.minZ && point.z <= box.maxZ);
}

export function intersect(a: AABB, b: AABB) {
  return (a.minX <= b.maxX && a.maxX >= b.minX) &&
    (a.minY <= b.maxY && a.maxY >= b.minY) &&
    (a.minZ <= b.maxZ && a.maxZ >= b.minZ);
}
