import { Object3D, PerspectiveCamera, } from 'three';
import { degToRad } from '../library/units';
import { Unsubscribe, Observable } from '../snaffle-bit';
import { TransformMatrix } from '../library/transformMatrix';

const playerHeight = 2;
const nearClippingPlaneDistance = 0.1;
const farClippingPlaneDistance = 500;
const playerFov = degToRad(75);

export class PlayerVisual extends Object3D {
  public headCamera: PerspectiveCamera;
  private setTransformEventUnsubscribe: Unsubscribe;
  constructor(setTransformEvent: Observable<[TransformMatrix, TransformMatrix]>, bodyMatrix: TransformMatrix, headMatrix: TransformMatrix) {
    super();
    this.headCamera = new PerspectiveCamera(playerFov, 0.5,
      nearClippingPlaneDistance, farClippingPlaneDistance);
    this.add(this.headCamera);
    this.setTransformEventUnsubscribe = setTransformEvent.subscribe(this.setTransform);
    this.setTransform(bodyMatrix, headMatrix);
  }

  private setTransform = (bodyMatrix: TransformMatrix, headMatrix: TransformMatrix) => {
    this.matrix.set(
      bodyMatrix[ 0], bodyMatrix[ 1], bodyMatrix[ 2], bodyMatrix[ 3],
      bodyMatrix[ 4], bodyMatrix[ 5], bodyMatrix[ 6], bodyMatrix[ 7],
      bodyMatrix[ 8], bodyMatrix[ 9], bodyMatrix[10], bodyMatrix[11],
      bodyMatrix[12], bodyMatrix[13], bodyMatrix[14], bodyMatrix[15],
    );
    this.matrix.decompose(this.position, this.quaternion, this.scale);
    this.headCamera.matrix.set(
      headMatrix[ 0], headMatrix[ 1], headMatrix[ 2], 0,
      headMatrix[ 4], headMatrix[ 5], headMatrix[ 6], playerHeight,
      headMatrix[ 8], headMatrix[ 9], headMatrix[10], 0,
      headMatrix[12], headMatrix[13], headMatrix[14], headMatrix[15],
    );
    this.headCamera.matrix.decompose(this.headCamera.position, this.headCamera.quaternion, this.headCamera.scale);
  }

  public dispose() {
    this.setTransformEventUnsubscribe();
  }
}
