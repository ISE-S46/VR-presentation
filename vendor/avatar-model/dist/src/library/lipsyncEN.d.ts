import { MorphTargets } from '../types/characters.type';
export declare const VISEME_MAP: Record<string, Record<string, number>>;
export declare const PHONEME_TO_VISEME: Record<string, string>;
export interface VisemeEvent {
    time: number;
    viseme: string;
    duration: number;
}
export declare function textToVisemes(text: string, wordsPerMinute?: number): VisemeEvent[];
export interface LipSyncOptions {
    blendSpeed?: number;
    restBlendSpeed?: number;
    idleBreath?: boolean;
    globalScale?: number;
}
export declare class LipSync {
    mesh: unknown;
    influences: number[];
    dictionary: Record<string, number>;
    blendSpeed: number;
    restBlendSpeed: number;
    idleBreath: boolean;
    globalScale: number;
    _active: boolean;
    _events: VisemeEvent[];
    _startTime: number;
    _currentTargets: Record<string, number>;
    _breathPhase: number;
    _eventIndex: number;
    _available: Set<string>;
    _allDrivenMorphs: Set<string>;
    _rest: Record<string, number>;
    constructor(morphTargets: MorphTargets, options?: LipSyncOptions);
    play(events: VisemeEvent[]): void;
    speakText(text: string, wordsPerMinute?: number): void;
    startAt(startTime: number, text: string, duration?: number | null, wordsPerMinute?: number): void;
    stop(): void;
    get isPlaying(): boolean;
    get totalDuration(): number;
    update(delta: number): void;
    private _getCurrentEvent;
    private _getNextEvent;
    private _buildTargets;
    private _applyMorphs;
    private _applyIdleBreath;
}
export interface AudioLipSyncOptions {
    smoothing?: number;
    gain?: number;
    blendSpeed?: number;
    restBlendSpeed?: number;
}
export declare class AudioLipSync {
    private _morph;
    smoothing: number;
    gain: number;
    blendSpeed: number;
    restBlendSpeed: number;
    private _ctx;
    private _analyser;
    private _dataArray;
    private _source;
    _running: boolean;
    constructor(morphTargets: MorphTargets, options?: AudioLipSyncOptions);
    fromAudioElement(audioEl: HTMLMediaElement): Promise<void>;
    fromMicrophone(): Promise<void>;
    private _initCtx;
    start(): void;
    stop(): void;
    dispose(): void;
    update(delta: number): void;
    private _applyAudioShapes;
}
