import { AnimationMixer, Object3D } from 'three';
import { ActionsMap, LoadCharacterResult } from '../types/characters.type';
export declare function loadCharacter(path: string, scene: Object3D): Promise<LoadCharacterResult>;
export declare function disposeCharacter(object: Object3D, mixer?: AnimationMixer, actions?: ActionsMap): void;
