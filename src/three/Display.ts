import { WebGLRenderer, Scene } from 'three';
import { PlayerVisual } from './PlayerVisual';
import Stats from 'stats.js';
import ResizeObserver from 'resize-observer-polyfill';
import { Level } from './Level';
import { simulateFrame } from '../mainLoop';

export class Display {
  private container: HTMLDivElement;
  private observer: ResizeObserver;
  private stats: Stats = new Stats();
  private renderer: WebGLRenderer;
  private player: PlayerVisual;
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
    this.scene = new Scene();
    this.scene.add(new Level());
    const aspect = this.getSize().width / this.getSize().height;
    this.player = new PlayerVisual();
    this.scene.add(this.player);
    this.player.headCamera.aspect = aspect;
    this.player.headCamera.updateProjectionMatrix();
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
    this.renderer.render(this.scene, this.player.headCamera);
  }
  
  private renderFrame = () => {
    window.requestAnimationFrame(this.renderFrame);
    this.stats.begin();
    simulateFrame();
    this.renderScene();
    this.stats.end();
  };

  private updateCameraAspect = () => {
    this.player.headCamera.aspect = this.getSize().width / this.getSize().height;
    this.player.headCamera.updateProjectionMatrix();
  };

  public getSize () {
    return this.renderer.getSize();
  }

}
