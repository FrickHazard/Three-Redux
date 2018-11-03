import { MeshBasicMaterial, Color } from 'three';

export const evenBoxSquareMaterial = new MeshBasicMaterial({
  color: new Color(0xff00ff),
});

export const oddBoxSquareMaterial = new MeshBasicMaterial({
  color: new Color(0x00ffff),
});