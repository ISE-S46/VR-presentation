import { Scene, WebGLRenderer, PMREMGenerator, Texture } from 'three';
export interface LightSetup {
    pmrem: PMREMGenerator;
    envMap: Texture | null;
}
export declare function setupLights(scene: Scene, renderer: WebGLRenderer): LightSetup;
export declare function disposeLights(scene: Scene, setup: LightSetup): void;
