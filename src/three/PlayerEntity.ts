import { Object3D, PerspectiveCamera, Vector3, Euler } from 'three';
import { degToRad } from '../utils/units';
import { playerBit, PlayerSnaffleBit } from '../../index';
import { Point3D } from '../utils/basicDataTypes';

const playerPitchRotationSpeed = 0.01;
const playerYawRotationSpeed = 0.01;
const playerSpeed = 3;
const playerHeight = 2;
const nearClippingPlaneDistance = 0.1;
const farClippingPlaneDistance = 500;
const playerFov = degToRad(75);

export class PlayerEntity extends Object3D {
  public yaw: number = 0;
  public pitch: number = 0;
  public headCamera: PerspectiveCamera;
  private bit: PlayerSnaffleBit;
  constructor() {
    super();
    this.position.set(0, 0, 14);
    this.headCamera = new PerspectiveCamera(playerFov, 0.5,
      nearClippingPlaneDistance, farClippingPlaneDistance);
    this.add(this.headCamera);
    this.headCamera.position.add(new Vector3(0, playerHeight, 0));
    document.addEventListener('keydown', this.onKeyPress);
    this.bit = playerBit.createRoot([
      {
        selector: (state) => {
          return {
            pitch: state.pitch,
            yaw: state.yaw,
            position: state.position
          };
        },
        callback: this.setTransformData,
      }
    ]);
  }

  private onKeyPress = (event: KeyboardEvent) => {
    if (event.keyCode === 38) {
     this.move(new Vector3(0, 0, -1));
    }
    else if (event.keyCode === 40) {
      this.move(new Vector3(0, 0, 1));
    }
    else if (event.keyCode === 37) {
      this.move(new Vector3(1, 0, 0));
    }
    else if (event.keyCode === 39) {
      this.move(new Vector3(-1, 0, 0));
    }
    else if (event.keyCode === 33) {
      this.move(new Vector3(0, 1, 0));
    }
    else if (event.keyCode === 34) {
      this.move(new Vector3(0, -1, 0));
    }

    else if (event.keyCode === 65) {
      this.rotatePitch(-playerPitchRotationSpeed);
    }
    else if (event.keyCode === 68) {
      this.rotatePitch(playerPitchRotationSpeed);
    }
    else if (event.keyCode === 87) {
      this.rotateYaw(-playerYawRotationSpeed);
    }
    else if (event.keyCode === 83) {
      this.rotateYaw(playerYawRotationSpeed);
    }
  }

  private move(direction: Vector3) {
    const movementVector = direction
      .clone()
      .applyQuaternion(this.headCamera.quaternion)
      .multiplyScalar(playerSpeed);        
    this.position.add(movementVector);
  }

  private rotateYaw(amount: number) {
    this.yaw += amount;
    this.quaternion.setFromEuler(new Euler(this.yaw, 0, 0));
  }

  private rotatePitch(amount: number) {
    this.pitch += amount;
    this.headCamera.quaternion.setFromEuler(new Euler(0, this.pitch, 0));
  }

  private setTransformData = (data: {
    yaw: number,
    pitch: number,
    position: Point3D
  }) => {
    this.headCamera.quaternion.setFromEuler(new Euler(0, data.pitch, 0));
    this.quaternion.setFromEuler(new Euler(data.yaw, 0, 0));
  }

  public dispose() {
    this.bit.dispose();
  }
}
