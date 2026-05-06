import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
export declare function createScene(): Scene;
export declare function createCamera(canvas: HTMLCanvasElement): PerspectiveCamera;
export declare function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer;
export declare function onResize(camera: PerspectiveCamera, renderer: WebGLRenderer, canvas: HTMLCanvasElement): void;
