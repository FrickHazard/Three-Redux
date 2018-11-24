
export interface ScalarField {
  valueAt: (x: number, y: number, z: number) => number;
  gradientAt: () => number;
}
