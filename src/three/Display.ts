import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { PlayerEntity } from '../entity/PlayerEntity';
import Stats from 'stats.js';
import ResizeObserver from 'resize-observer-polyfill';
import { Level } from './Level';
import { simulateFrame } from '../mainLoop';
import { createIdentityMatrix } from '../library/transformMatrix';

const tempPlayerSeedData = {
  intialData: {
    pitch: 0,
    yaw: 0,
    bodyTransformMatrix: createIdentityMatrix(),
    headTransformMatrix: createIdentityMatrix(),
    rigidbodyData: {
      mass: 3,
      velocity: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 }
    }
  }
};

export class Display {
  private container: HTMLDivElement;
  private observer: ResizeObserver;
  private stats: Stats = new Stats();
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  constructor(divElement: HTMLDivElement) {
    this.container = divElement;
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x272727);
    this.container.appendChild(this.stats.dom);
    // stick stats to top left of canvas
    this.stats.dom.style.top = '';
    this.stats.dom.style.left = '';
    this.container.appendChild(this.renderer.domElement);
    // temp stuff
    this.scene = new Scene();
    this.scene.add(new Level());
    const playerEntity = new PlayerEntity({ ...tempPlayerSeedData, sceneToAddTo: this.scene });
    const aspect = this.getSize().width / this.getSize().height;
    this.camera = playerEntity.visual.headCamera;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.observer = new ResizeObserver(() => this.onSizeChange());
    this.observer.observe(this.container);
    this.renderFrame();
  }

  private onSizeChange() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.updateCameraAspect();
    this.renderScene();
  }

  private renderScene() {
    this.renderer.render(this.scene, this.camera);
  }
  
  private renderFrame = () => {
    window.requestAnimationFrame(this.renderFrame);
    this.stats.begin();
    simulateFrame();
    this.renderScene();
    this.stats.end();
  };

  private updateCameraAspect = () => {
    this.camera.aspect = this.getSize().width / this.getSize().height;
    this.camera.updateProjectionMatrix();
  };

  public getSize () {
    return this.renderer.getSize();
  }

}
