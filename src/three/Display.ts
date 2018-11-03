import { WebGLRenderer, PerspectiveCamera } from 'three';
import { SceneManager } from './SceneManager';
import Stats from 'stats.js';
import ResizeObserver from 'resize-observer-polyfill';

export class Display {
  private displayId: number = 1;
  private container: HTMLDivElement;
  private observer: ResizeObserver;
  private camera: PerspectiveCamera;
  private stats: Stats = new Stats();
  private renderer: WebGLRenderer;
  constructor(divElement: HTMLDivElement) {
    this.container = divElement;
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x272727);
    this.container.appendChild(this.stats.dom);
    this.container.appendChild(this.renderer.domElement);
    const aspect = this.getSize().width / this.getSize().height;
    this.camera = new PerspectiveCamera(75, aspect, 0.1, 500);
    this.camera.position.setZ(10);
    this.observer = new ResizeObserver(() => this.onSizeChange());
    this.observer.observe(this.container);
    this.renderFrame();
  }

  private onSizeChange() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.updateCameraAspect();
    this.renderFrame();
  }

  private renderFrame = () => {
    this.stats.begin();
    this.renderer.render(SceneManager.getScene(this.displayId), this.camera);
    this.stats.end();
    window.requestAnimationFrame(this.renderFrame);
  };

  private updateCameraAspect = () => {
    this.camera.aspect = this.getSize().width / this.getSize().height;
    this.camera.updateProjectionMatrix();
  };

  public getSize () {
    return this.renderer.getSize();
  }

}
