import { AnimationAction, AnimationMixer, Mesh, Object3D } from 'three';
export type ActionsMap = Record<string, AnimationAction>;
export interface AnimationControllerParams {
    actions: ActionsMap;
    mixer?: AnimationMixer;
    lipSync?: {
        stop: () => void;
    };
    audioLipSync?: {
        stop: () => void;
    };
}
export interface AnimationController {
    switchAction: (name: string) => void;
    stopAll: () => void;
    setTimeScale: (value: number) => void;
    getCurrentAction: () => string | null;
    dispose: () => void;
}
export interface MorphTargets {
    mesh: Mesh;
    influences: number[];
    dictionary: {
        [key: string]: number;
    };
}
export interface LoadCharacterResult {
    object: Object3D;
    mixer: AnimationMixer;
    actions: ActionsMap;
    morphTargets: MorphTargets | null;
}
