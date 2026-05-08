import { LipSync } from '../library/lipsyncEN';
import { TTSHandler } from '../service/tts';
import { AnimationController } from '../types/characters.type';
export declare class AudioManager {
    private audioCtx;
    private audio;
    private audioUrl;
    private lipSync;
    private controller;
    private ttsHandler;
    private playStartTime;
    private lastDriftCorrection;
    private listeners;
    constructor();
    setRefs(lipSync: LipSync, controller: AnimationController, tts: TTSHandler | null): void;
    private initAudioContext;
    cleanup(): void;
    dispose(): void;
    speakTTS(text: string): Promise<void>;
    speakLocal(url: string, text: string): Promise<void>;
    private playWithTextSync;
    applyDriftCorrection(): void;
    suspendAudio(): void;
    resumeAudio(): void;
    forceResync(): void;
}
