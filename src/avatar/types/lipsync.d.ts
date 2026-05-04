import type { MorphTargets } from './characters.type';

declare module '../../library/lipsyncEN.js' {
  export class LipSync {
    constructor(morphTargets: MorphTargets, options?: {
      blendSpeed?: number;
      restBlendSpeed?: number;
      idleBreath?: boolean;
    });

    startAt(startTime: number, text: string, durationMs: number): void;
    stop(): void;
    update(delta: number): void;
    readonly isPlaying: boolean;
    readonly _running: boolean;
    _startTime: number;
  }

  export class AudioLipSync {
    constructor(morphTargets: MorphTargets, options?: { gain?: number });
    stop(): void;
    update(delta: number): void;
    readonly _running: boolean;
  }
}

declare module '../../library/lipsyncEN' {
  export * from '../../library/lipsyncEN.js';
}
