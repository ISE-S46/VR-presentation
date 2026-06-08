import { useCallback, useEffect, useRef, useState } from 'react';
import { createAvatarScene } from 'avatar-model';
import '../styles/components/CharacterViewer.css';

function supportsWebGL() {
  try {
    const testCanvas = document.createElement('canvas');
    const gl =
      testCanvas.getContext('webgl2') ||
      testCanvas.getContext('webgl') ||
      testCanvas.getContext('experimental-webgl');

    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

function AvatarCanvas({
  modelPath,
  audioURL,
  script,
  ttsEndpoint,
  button,
  modelScale,
  modelPosition,
  cameraPosition,
  section,
}) {
  const canvasRef = useRef(null);
  const destroyRef = useRef(null);
  const ttsEndpointRef = useRef(ttsEndpoint);
  const [controller, setController] = useState(null);
  const [loadState, setLoadState] = useState('loading');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    ttsEndpointRef.current = ttsEndpoint;
  }, [ttsEndpoint]);

  const proxiedTtsEndpoint = useCallback((text) => {
    return ttsEndpointRef.current?.(text);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    setLoadState('loading');
    setLoadError('');

    (async () => {
      try {
        if (!supportsWebGL()) {
          setLoadState('error');
          setLoadError('Avatar standby mode. Enable browser hardware acceleration for the full 3D presenter.');
          return;
        }

        const { controller: avatarController, destroy } = await createAvatarScene(canvas, {
          modelUrl: modelPath,
          audioUrl: audioURL,
          script: '',
          ttsEndpoint: ttsEndpointRef.current ? proxiedTtsEndpoint : undefined,
          button,
          modelScale,
          modelPosition,
          cameraPosition
        });

        if (cancelled) {
          destroy();
          return;
        }

        setController(avatarController);
        destroyRef.current = destroy;
        setLoadState('ready');
      } catch (err) {
        if (!cancelled) {
          setLoadState('error');
          setLoadError(err?.message || 'Unable to load the avatar model.');
        }
      }
    })();

    return () => {
      cancelled = true;
      destroyRef.current?.();
      destroyRef.current = null;
      setController(null);
    };
  }, [audioURL, button, cameraPosition, modelPath, modelPosition, modelScale, proxiedTtsEndpoint]);

  useEffect(() => {
    if (controller) {
      if (script) {
        controller.speak(script);
      } else {
        try {
          controller.audioManager?.cleanup();
          controller.lipSync?.stop();
          controller.animCtrl?.switchAction("Idle");
        } catch (e) {
          console.error("Error cleaning up avatar speech:", e);
        }
      }
    }
  }, [controller, script]);

  useEffect(() => {
    const handlePause = () => {
      if (controller && controller.audioManager?.audio) {
        try {
          controller.audioManager.audio.pause();
          controller.animCtrl?.switchAction("Idle");
        } catch (e) {
          console.error("Error pausing avatar playback:", e);
        }
      }
    };

    const handleResume = () => {
      if (controller && controller.audioManager?.audio) {
        try {
          if (!controller.audioManager.audio.ended) {
            controller.animCtrl?.switchAction("Talk");
          }
          controller.audioManager.audio.play();
          controller.audioManager.forceResync();
        } catch (e) {
          console.error("Error resuming avatar playback:", e);
        }
      }
    };

    window.addEventListener('avatar-pause-playback', handlePause);
    window.addEventListener('avatar-resume-playback', handleResume);
    return () => {
      window.removeEventListener('avatar-pause-playback', handlePause);
      window.removeEventListener('avatar-resume-playback', handleResume);
    };
  }, [controller]);

  return (
    <>
      <canvas ref={canvasRef} className="avatar-canvas" aria-label={section} />
      {loadState === 'loading' && (
        <div className="character-viewer-loading" role="status" aria-live="polite">
          <div className="loading-spinner" />
          <span>Loading avatar</span>
        </div>
      )}
      {loadState === 'error' && (
        <div className="character-viewer-loading character-viewer-loading--error" role="status">
          <span className="character-viewer-error-icon">3D</span>
          <span>{loadError}</span>
        </div>
      )}
    </>
  );
}

export default function CharacterViewer({
  modelPath,
  audioURL,
  script,
  ttsEndpoint = undefined, // Explicitly default to undefined to make it optional
  section = 'Interactive Avatar',
  button = true,
  modelScale,
  modelPosition,
  cameraPosition
}) {
  return (
    <div className="character-viewer-container">
      <AvatarCanvas
        modelPath={modelPath}
        audioURL={audioURL}
        script={script}
        ttsEndpoint={ttsEndpoint}
        button={button}
        modelScale={modelScale}
        modelPosition={modelPosition}
        cameraPosition={cameraPosition}
        section={section}
      />
    </div>
  );
}
