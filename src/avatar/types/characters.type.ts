import {
  AnimationAction,
  AnimationMixer,
  Mesh,
  Object3D
} from 'three';
import { LipSync, AudioLipSync } from '../../library/lipsyncEN.js';

export type ActionsMap = Record<string, AnimationAction>;

export interface AnimationControllerParams {
  actions: ActionsMap;
  mixer?: AnimationMixer;
  lipSync?: { stop: () => void };
  audioLipSync?: { stop: () => void };
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
  dictionary: { [key: string]: number };
}

export interface LoadCharacterResult {
  object: Object3D;
  mixer: AnimationMixer;
  actions: ActionsMap;
  morphTargets: MorphTargets | null;
}

export interface CharacterRefs {
  mixer: AnimationMixer;
  lipSync: LipSync;
  audioLipSync: AudioLipSync;
}

export interface CharacterLoaderResult {
  ready: boolean;
  actions: ActionsMap;
  morphTargets: MorphTargets | null;
  controller: AnimationController | null;
  /** Live refs for use inside rAF — always current, never stale */
  refs: React.RefObject<CharacterRefs | null>;
  controllerRef: React.RefObject<AnimationController | null>;
}

export interface SpeakRefs {
  audio: HTMLAudioElement | null;
  lipSync: LipSync | null;
  controller: AnimationController | null;
}