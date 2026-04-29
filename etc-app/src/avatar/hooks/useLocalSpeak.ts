import { useCallback, useEffect, useRef } from 'react';
import type { SpeakRefs } from '../types/characters.type.js';

export function useLocalSpeak(speakRefsRef: React.RefObject<SpeakRefs>) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioListenersRef = useRef<{ playing: () => void; ended: () => void } | null>(null);
  const lastDriftCorrectionRef = useRef<number>(0);
  const playStartTimeRef = useRef<number>(0);

  // Unlock AudioContext on first user interaction
  useEffect(() => {
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const onFirstInteraction = () => void audioCtx.resume();
    window.addEventListener('click', onFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', onFirstInteraction);
      audioCtx.close();
      audioCtxRef.current = null;
    };
  }, []);

  const cleanupAudio = useCallback(() => {
    const audio = audioRef.current;
    const listeners = audioListenersRef.current;

    if (audio) {
      if (listeners) {
        audio.removeEventListener('playing', listeners.playing);
        audio.removeEventListener('ended', listeners.ended);
        audioListenersRef.current = null;
      }
      audio.pause();
      audioRef.current = null;
    }
    // Note: No URL.revokeObjectURL needed here for static MP3 files
  }, []);

  // Accept BOTH the path to the MP3 and the text (for the lip-sync generator)
  const speakLocal = useCallback(async (mp3Url: string, text: string) => {
    const lipSync = speakRefsRef.current?.lipSync;
    if (!lipSync) return;

    cleanupAudio();
    lipSync.stop();

    // Directly use the provided MP3 URL instead of fetching a Blob
    const audio = new Audio(mp3Url);
    // Preload aggressively so the browser buffers before we call play()
    audio.preload = 'auto';

    const audioCtx = audioCtxRef.current;
    if (audioCtx?.state === 'suspended') await audioCtx.resume();

    // Wait for canplaythrough — guarantees audio is buffered and duration is accurate.
    // Falls back to loadedmetadata after 3s in case canplaythrough never fires
    // (e.g. very large files or poor network).
    await new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        resolve();
      };
      audio.addEventListener('canplaythrough', done, { once: true });
      audio.addEventListener('loadedmetadata', () => {
        // Fallback: if canplaythrough hasn't fired within 3s, proceed anyway
        setTimeout(done, 3000);
      }, { once: true });
      audio.load();
    });

    const durationMs = audio.duration * 1000;

    const onPlaying = () => {
      // Switch to Talk animation when audio starts
      speakRefsRef.current?.controller?.switchAction('Talk');

      // audio.currentTime may already be >0 if the browser pre-decoded some
      // frames before firing 'playing'. Back-calculating the true start time
      // keeps lipsync anchored to the actual audio output position.
      const alreadyElapsedMs = audio.currentTime * 1000;
      const adjustedStart = performance.now() - alreadyElapsedMs;
      playStartTimeRef.current = adjustedStart;
      lipSync.startAt(adjustedStart, text, durationMs);
    };

    const onEnded = () => {
      // Return to Idle animation when audio finishes
      speakRefsRef.current?.controller?.switchAction('Idle');
      lipSync.stop();
      cleanupAudio();
    };

    audioListenersRef.current = { playing: onPlaying, ended: onEnded };
    audio.addEventListener('playing', onPlaying, { once: true });
    audio.addEventListener('ended', onEnded, { once: true });

    try {
      await audio.play();
      audioRef.current = audio;
    } catch (err) {
      console.error('[speakLocal] audio.play() failed:', err);
      // Ensure we return to Idle if play() throws
      speakRefsRef.current?.controller?.switchAction('Idle');
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audioListenersRef.current = null;
      cleanupAudio();
    }
  }, [speakRefsRef, cleanupAudio]);

  const applyDriftCorrection = useCallback(() => {
    const audio = audioRef.current;
    const lipSync = speakRefsRef.current?.lipSync;
    if (!audio || !lipSync?.isPlaying) return;

    const now = performance.now();

    // Use a tighter throttle in the first 2 seconds to aggressively correct
    // early drift (which is when buffering-related offset is largest),
    // then relax to 100ms for steady-state correction.
    const elapsed = now - playStartTimeRef.current;
    const throttle = elapsed < 2000 ? 33 : 100; // ~30fps vs ~10fps corrections

    if (now - lastDriftCorrectionRef.current < throttle) return;
    lastDriftCorrectionRef.current = now;

    const drift = (now - lipSync._startTime) - audio.currentTime * 1000;
    if (Math.abs(drift) > 20) {
      // More aggressive correction factor in the first 2s (0.3 vs 0.15)
      const factor = elapsed < 2000 ? 0.3 : 0.15;
      lipSync._startTime += drift * factor;
    }
  }, [speakRefsRef]);

  return { speakLocal, applyDriftCorrection, cleanupAudio };
}