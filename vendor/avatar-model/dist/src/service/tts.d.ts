export type TTSHandler = (text: string) => Promise<Response>;
export declare function resolveTTS(endpoint: string | TTSHandler | undefined): TTSHandler | null;
