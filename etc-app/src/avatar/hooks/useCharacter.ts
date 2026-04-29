import {
  useRef,
  useState,
  useEffect,
  useCallback
} from 'react';
import { useScene } from './useScene';
import { useCharacterLoader } from './useCharacterLoader';
import { useSpeak } from './useSpeak';
import { useLocalSpeak } from './useLocalSpeak';
import type { SpeakRefs } from '../types/characters.type';
import type { Scene } from 'three';

/**
 * Coordinates useScene, useCharacterLoader, useSpeak, and useLocalSpeak.
 */
export function useCharacter(modelUrl: string = '/model/LowRes2.glb') {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);

  // onFrame is a ref so we can update the rAF body without restarting the loop
  const onFrame = useRef<(delta: number) => void>(() => { });

  const { controlsRef } = useScene(canvasRef, (s: Scene) => {
    setScene(s);
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  }, (delta) => onFrame.current(delta));

  const {
    ready,
    actions,
    morphTargets,
    controller,
    refs: characterRefsRef,
  } = useCharacterLoader(scene, modelUrl);

  // speakRefsRef is a stable ref that useSpeak reads — avoids stale closures
  const speakRefsRef = useRef<SpeakRefs>({ audio: null, lipSync: null, controller: null });

  // Mutate only the lipSync field instead of allocating a new object every render
  speakRefsRef.current.lipSync = characterRefsRef.current?.lipSync ?? null;
  speakRefsRef.current.controller = controller;

  // Destructure and ALIAS the returns to prevent name collisions
  const {
    speak: ttsSpeak,
    applyDriftCorrection: ttsDriftCorrection,
    cleanupAudio: ttsCleanup
  } = useSpeak(speakRefsRef);

  const {
    speakLocal: localSpeak,
    applyDriftCorrection: localDriftCorrection,
    cleanupAudio: localCleanup
  } = useLocalSpeak(speakRefsRef);

  // Cross-cleanup wrappers — useCallback prevents new references on every render
  const speak = useCallback(async (text: string) => {
    localCleanup();
    await ttsSpeak(text);
  }, [localCleanup, ttsSpeak]);

  const speakLocal = useCallback(async (mp3Url: string, text: string) => {
    ttsCleanup();
    await localSpeak(mp3Url, text);
  }, [ttsCleanup, localSpeak]);

  // Wire the rAF frame callback
  onFrame.current = (delta: number) => {
    const refs = characterRefsRef.current;
    if (!refs) return;

    refs.mixer.update(delta);

    if (refs.audioLipSync._running) {
      refs.audioLipSync.update(delta);
    } else {
      refs.lipSync.update(delta);
    }

    // Both internal methods check if their specific audio is playing
    ttsDriftCorrection();
    localDriftCorrection();
  };

  // Cleanup both hooks on unmount
  useEffect(() => {
    return () => {
      ttsCleanup();
      localCleanup();
    };
  }, [ttsCleanup, localCleanup]);

  return {
    canvasRef,
    speak,
    speakLocal,
    ready,
    actions,
    controller,
    morphTargets,
    controlsRef
  };
}