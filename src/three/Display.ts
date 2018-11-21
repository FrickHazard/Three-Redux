import { WebGLRenderer, Scene } from 'three';
import { PlayerEntity } from './PlayerEntity';
import { frameBit, FrameDataSnaffleBit, playerMoveEvent } from '../../index';
import Stats from 'stats.js';
import ResizeObserver from 'resize-observer-polyfill';
import { Level } from './Level';

export class Display {
  private container: HTMLDivElement;
  private observer: ResizeObserver;
  private stats: Stats = new Stats();
  private renderer: WebGLRenderer;
  private player: PlayerEntity;
  private scene: Scene;
  private frameBit: FrameDataSnaffleBit = frameBit.createRoot();
  constructor(divElement: HTMLDivElement) {
    this.container = divElement;
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x272727);
    this.container.appendChild(this.stats.dom);
    this.container.appendChild(this.renderer.domElement);
    this.scene = new Scene();
    this.scene.add(new Level());
    const aspect = this.getSize().width / this.getSize().height;
    this.player = new PlayerEntity();
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
    this.renderFrame();
  }

  private renderFrame = () => {
    this.stats.begin();
    const start = performance.now();
    this.renderer.render(this.scene, this.player.headCamera);
    const end = performance.now();
    const frameLengthMiliseconds = end - start;
    this.frameBit.computeFrameData(frameLengthMiliseconds);
    playerMoveEvent.notify();
    this.stats.end();
    window.requestAnimationFrame(this.renderFrame);
  };

  private updateCameraAspect = () => {
    this.player.headCamera.aspect = this.getSize().width / this.getSize().height;
    this.player.headCamera.updateProjectionMatrix();
  };

  public getSize () {
    return this.renderer.getSize();
  }

}
