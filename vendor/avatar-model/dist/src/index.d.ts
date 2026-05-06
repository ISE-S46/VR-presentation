import { AvatarController } from './core/avatarController';
import { TTSHandler } from './service/tts';
export interface AvatarOptions {
    modelUrl: string;
    script?: string;
    audioUrl?: string;
    ttsEndpoint?: string | TTSHandler;
    button?: boolean;
    element?: HTMLElement | null;
    event?: string;
}
export interface AvatarScene {
    controller: AvatarController;
    /** Disposes the controller AND removes any event listener added to options.element */
    destroy: () => void;
}
export declare function createAvatarScene(canvas: HTMLCanvasElement, options: AvatarOptions): Promise<AvatarScene>;
