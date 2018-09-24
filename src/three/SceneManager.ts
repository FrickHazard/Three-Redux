import { Scene } from "three";
import { Level } from './Level';

export class SceneManager {
  public static mainScene = new Scene();
  public static getScene(displayId: number) {
    // later do scene handling logic
    return this.mainScene;
  }
  public static startup() {
    SceneManager.mainScene.add(new Level());
  }
}

// SceneManager.mainScene.autoUpdate = false;