import { createContext } from 'react';

export interface CharacterContextType {
  speak: (text: string) => Promise<void>;
  speakLocal: (mp3Url: string, text: string) => Promise<void>;
}

export const CharacterContext =
  createContext<CharacterContextType | null>(null);