import { Object3D, PerspectiveCamera, Vector3, Euler } from 'three';
import { degToRad } from '../library/units';
import { playerTransformLogSnaffleBitProvider, PlayerTransformLogSnaffleBit, playerMoveEvent } from '../../index';
import { Point3D, Point2D } from '../library/basicDataTypes';
import { Unsubscribe } from '../snaffle-bit';

const playerHeight = 2;
const nearClippingPlaneDistance = 0.1;
const farClippingPlaneDistance = 500;
const playerFov = degToRad(75);

export class PlayerEntity extends Object3D {
  public yaw: number = 0;
  public pitch: number = 0;
  public headCamera: PerspectiveCamera;
  private playerTransformLogSnaffleBit: PlayerTransformLogSnaffleBit;
  private playerMoveEventUnsubscribe: Unsubscribe;
  constructor() {
    super();
    this.position.set(0, 0, 14);
    this.headCamera = new PerspectiveCamera(playerFov, 0.5,
      nearClippingPlaneDistance, farClippingPlaneDistance);
    this.add(this.headCamera);
    this.headCamera.position.add(new Vector3(0, playerHeight, 0));
    this.playerTransformLogSnaffleBit = playerTransformLogSnaffleBitProvider.createRoot();
    this.playerMoveEventUnsubscribe = playerMoveEvent.subscribe(this.setTransform);
  }

  private setTransform = (input: {
    movementAxisInput: Point3D,
    lookAxisInput: Point2D,
  }) => {
    if (
      input.lookAxisInput.x == 0 &&
      input.lookAxisInput.y == 0 &&
      input.movementAxisInput.x === 0 &&
      input.movementAxisInput.y === 0 &&
      input.movementAxisInput.z === 0) return;
    this.yaw += input.lookAxisInput.x;
    this.quaternion.setFromEuler(new Euler(this.yaw, 0, 0));
    this.pitch += input.lookAxisInput.y;
    this.headCamera.quaternion.setFromEuler(new Euler(0, this.pitch, 0));

    const movementVector = new Vector3().set(
      input.movementAxisInput.x,
      input.movementAxisInput.y,
      input.movementAxisInput.z)
      .applyQuaternion(this.headCamera.quaternion);   
    this.position.add(movementVector);
    this.playerTransformLogSnaffleBit.logPlayerTransform({
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      },
      pitch: this.pitch,
      yaw: this.yaw,
    });
  }

  public dispose() {
    this.playerMoveEventUnsubscribe();
    this.playerTransformLogSnaffleBit.dispose();
  }
}
