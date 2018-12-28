import { TransformMatrix } from '../library/transformMatrix';
import { RigidbodyData } from '../library/physics';
import { PlayerVisual } from '../three/PlayerVisual';
import { playerTransformDataStore,  } from '../../';
import { Scene } from 'three';

interface PlayerEntityData {
  pitch: number;
  yaw: number;
  bodyTransformMatrix: TransformMatrix;
  headTransformMatrix: TransformMatrix;
  rigidbodyData: RigidbodyData;
}

interface PlayerEntitySeed {
  readonly sceneToAddTo: Scene;
  readonly intialData: PlayerEntityData;
};

export class PlayerEntity {
  public readonly data: PlayerEntityData;
  public readonly visual: PlayerVisual;
  constructor(seed: PlayerEntitySeed) {
    const event = function(listener:(bodyMat: TransformMatrix, headMat: TransformMatrix) => void) {
      const callback = function() {
        const { bodyTransformMatrix, headTransformMatrix } = playerTransformDataStore.getState();
        listener(bodyTransformMatrix, headTransformMatrix);
      }
      return playerTransformDataStore.subscribe(callback);
    }
    this.visual = new PlayerVisual({ subscribe: event }, seed.intialData.bodyTransformMatrix, seed.intialData.headTransformMatrix);
    seed.sceneToAddTo.add(this.visual);
    this.data = seed.intialData;
  }
}

