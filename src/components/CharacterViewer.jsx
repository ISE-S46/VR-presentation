import React, { useEffect, useRef } from 'react';
import { createAvatarScene } from 'avatar-model';
import VRPlaceholder from './VRPlaceholder';
import '../styles/components/CharacterViewer.css';

function AvatarCanvas({ modelPath, audioURL, script, ttsEndpoint, button, modelScale, modelPosition }) {
  const canvasRef = useRef(null);
  const destroyRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    (async () => {
      try {
        const { controller, destroy } = await createAvatarScene(canvas, {
          modelUrl: modelPath,
          audioUrl: audioURL,
          script,
          ttsEndpoint,
          button,
          modelScale,
          modelPosition,
        });

        if (cancelled) {
          destroy();
          return;
        }

        controllerRef.current = controller;
        destroyRef.current = destroy;
      } catch (err) {
        console.error('[CharacterViewer] Failed to init avatar:', err);
      }
    })();

    return () => {
      cancelled = true;
      destroyRef.current?.();
      destroyRef.current = null;
      controllerRef.current = null;
    };
  }, [modelPath]);

  useEffect(() => {
    if (controllerRef.current && script) {
      controllerRef.current.speak(script); 
    }
  }, [script]);

  return <canvas ref={canvasRef} className="avatar-canvas" />;
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
}) {
  const isPlaceholder = !modelPath || modelPath === 'placeholder';

  if (isPlaceholder) {
    return (
      <div className="character-viewer-container">
        <VRPlaceholder section={section} style={{ height: '100%', border: 'none' }} />
      </div>
    );
  }

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
      />
    </div>
  );
}