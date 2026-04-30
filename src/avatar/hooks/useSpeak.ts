import { useCallback, useEffect, useRef } from 'react';
import { texttospeech } from '../service/tts.js';
import type { SpeakRefs } from '../types/characters.type.js';

/**
 * Owns the AudioContext (autoplay unlock only), blob URL lifecycle,
 * event listener cleanup on interruption, and drift correction.
 *
 * @param speakRefsRef  Live ref updated by the caller each render —
 *                      avoids stale closures without re-creating speak().
 */
export function useSpeak(speakRefsRef: React.RefObject<SpeakRefs>) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
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

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    const lipSync = speakRefsRef.current?.lipSync;
    if (!lipSync) return;

    cleanupAudio();
    lipSync.stop();

    let res: Response;
    try {
      res = await texttospeech(text);
    } catch (err) {
      console.error('[speak] TTS fetch failed:', err);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioUrlRef.current = url;

    const audio = new Audio(url);
    audio.preload = 'auto';

    const audioCtx = audioCtxRef.current;
    if (audioCtx?.state === 'suspended') await audioCtx.resume();

    // Wait for canplaythrough — guarantees audio is buffered and duration is accurate.
    // Falls back after 3s for large files or slow networks.
    await new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        resolve();
      };
      audio.addEventListener('canplaythrough', done, { once: true });
      audio.addEventListener('loadedmetadata', () => {
        setTimeout(done, 3000);
      }, { once: true });
      audio.load();
    });

    const durationMs = audio.duration * 1000;

    const onPlaying = () => {
      // Switch to Talk animation when audio starts
      speakRefsRef.current?.controller?.switchAction('Talk');

      // Back-calculate start time accounting for any pre-decoded frames
      // already consumed before the 'playing' event fired.
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
      console.error('[speak] audio.play() failed:', err);
      // Ensure we return to Idle if play() throws
      speakRefsRef.current?.controller?.switchAction('Idle');
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audioListenersRef.current = null;
      cleanupAudio();
    }
  }, [speakRefsRef, cleanupAudio]);

  /**
   * Call this inside the rAF loop — throttled drift correction.
   * Reads audioRef and lipSync from refs so it's always current.
   */
  const applyDriftCorrection = useCallback(() => {
    const audio = audioRef.current;
    const lipSync = speakRefsRef.current?.lipSync;
    if (!audio || !lipSync?.isPlaying) return;

    const now = performance.now();

    // Tighter throttle in the first 2s for aggressive early correction
    const elapsed = now - playStartTimeRef.current;
    const throttle = elapsed < 2000 ? 33 : 100;

    if (now - lastDriftCorrectionRef.current < throttle) return;
    lastDriftCorrectionRef.current = now;

    const drift = (now - lipSync._startTime) - audio.currentTime * 1000;
    if (Math.abs(drift) > 20) {
      const factor = elapsed < 2000 ? 0.3 : 0.15;
      lipSync._startTime += drift * factor;
    }
  }, [speakRefsRef]);

  // Expose cleanupAudio so useCharacter can call it on unmount
  return { speak, applyDriftCorrection, cleanupAudio };
}