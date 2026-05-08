import { AnimationController } from '../types/characters.type';
import { TTSHandler } from '../service/tts';
export interface AvatarControllerOptions {
    ttsEndpoint?: string | TTSHandler;
    modelScale?: number;
    modelPosition?: [number, number, number];
    cameraPosition?: [number, number, number];
}
export declare class AvatarController {
    private canvas;
    private scene;
    private camera;
    private renderer;
    private controls;
    private lightSetup;
    private audioManager;
    private timer;
    private options;
    private character;
    private animCtrl;
    private lipSync;
    private audioLipSync;
    private rafId;
    private isVisible;
    private isDisposed;
    constructor(canvas: HTMLCanvasElement, options?: AvatarControllerOptions);
    loadModel(modelPath: string): Promise<void>;
    speak(text: string): Promise<void>;
    speakLocal(url: string, text: string): Promise<void>;
    setControlsEnabled(enabled: boolean): void;
    /** Returns raw data for an optional lil-gui debug panel */
    getDevData(): {
        actions: import('../types/characters.type').ActionsMap;
        controller: AnimationController | null;
        morphTargets: import('../types/characters.type').MorphTargets | null;
    };
    private animate;
    private onResizeBound;
    private onVisibilityBound;
    dispose(): void;
}
