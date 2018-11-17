import { MeshBasicMaterial, MeshLambertMaterial, Color } from 'three';

export const evenBoxSquareMaterial = new MeshLambertMaterial({
  color: new Color(0xff00ff),
});

export const oddBoxSquareMaterial = new MeshLambertMaterial({
  color: new Color(0x00ffff),
});