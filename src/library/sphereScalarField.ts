import { ScalarField } from './ScalarField';

export function createSphereScalarField(radius: number): ScalarField {
  return {
    valueAt: function(x, y, z) {
      return radius - Math.sqrt(x*x + y*y + z*z);
    },
    gradientAt: function(x, y, z) {
      const l = Math.sqrt(x*x + y*y + z*z);
      return { x: -x / l, y: -y / l, z: -z / l };
    }
  };
}