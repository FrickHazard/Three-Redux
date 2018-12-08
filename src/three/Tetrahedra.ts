import { Mesh, Geometry, Vector3, Face3, MeshMaterialType } from 'three';
import { Tetrahedron } from '../library/marchingTetra';

export class TetrahedronVisual extends Mesh {
  constructor(tetra: Tetrahedron, material: MeshMaterialType) {
    const geometry = new Geometry();
    geometry.vertices = [
      new Vector3(tetra.p0.x, tetra.p0.y, tetra.p0.z),
      new Vector3(tetra.p1.x, tetra.p1.y, tetra.p1.z),
      new Vector3(tetra.p2.x, tetra.p2.y, tetra.p2.z),
      new Vector3(tetra.p3.x, tetra.p3.y, tetra.p3.z)
    ];
    // buildVert(tetrahedron.p2, tetrahedron.p0, isolevel),
    // buildVert(tetrahedron.p2, tetrahedron.p3, isolevel),
    // buildVert(tetrahedron.p2, tetrahedron.p1, isolevel)
    geometry.faces = [
      new Face3(0, 1, 2),
      new Face3(0, 2, 3),
      new Face3(0, 1, 3),
      new Face3(1, 2, 3)
    ];
    geometry.computeVertexNormals();
    geometry.computeFaceNormals();
    geometry.computeBoundingBox();
    super(geometry, material);
  }
};
