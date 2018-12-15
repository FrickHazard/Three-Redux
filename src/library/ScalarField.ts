import { Point3D } from "./basicDataTypes";

export interface ScalarField {
  valueAt: (x: number, y: number, z: number) => number;
  gradientAt: (x: number, y: number, z: number) => Point3D;
}
