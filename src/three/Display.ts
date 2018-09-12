import { WebGLRenderer, PerspectiveCamera } from 'three';
import { SceneManager } from './SceneManager';
import Stats from 'stats.js';

export class Display {
  // private sceneManager
  // Display id
  private camera: PerspectiveCamera;
  private stats: Stats = new Stats();
  private renderer: WebGLRenderer;
  constructor(domElement: HTMLDivElement) {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(domElement.clientWidth, domElement.clientHeight);
    this.renderer.setClearColor(0x272727);
    domElement.appendChild(this.stats.dom);
    domElement.appendChild(this.renderer.domElement);
    const aspect = this.getSize().height / this.getSize().width;
    this.camera = new PerspectiveCamera(75, aspect, 0.1, 500);
    this.renderFrame();
  }

  private renderFrame = () => {
    this.stats.begin();
    this.renderer.render(SceneManager.mainScene, this.camera);
    this.stats.end();
    window.requestAnimationFrame(this.renderFrame);
  };

  public getSize () {
    return this.renderer.getSize();
  }

}
