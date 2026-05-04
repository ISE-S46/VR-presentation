import React, { Suspense } from 'react';
import AvatarApp from '../avatar/App';
import VRPlaceholder from './VRPlaceholder';
import '../styles/components/CharacterViewer.css';

export default function CharacterViewer({ modelPath, audioURL, script, section = "Interactive Avatar", ...threeProps }) {
  // Check if we need to fall back to the wireframe placeholder
  const isPlaceholder = !modelPath || modelPath === 'placeholder';

  // If no valid model is provided, display the UI wireframe
  if (isPlaceholder) {
    return (
      <div className="character-viewer-container">
        <VRPlaceholder section={section} style={{ height: '100%', border: 'none' }} />
      </div>
    );
  }

  // If a valid model path IS provided, load the heavy 3D canvas
  return (
    <div className="character-viewer-container">
      <Suspense
        fallback={
          <div className="character-viewer-loading">
            <div className="loading-spinner" />
            <span>Loading Interactive Avatar...</span>
          </div>
        }
      >
        {/* spread ...threeProps to easily pass scale, position, etc. to the system */}
        <AvatarApp
          modelUrl={modelPath}
          audioUrl={audioURL}
          script={script}
          {...threeProps}
        />
      </Suspense>
    </div>
  );
}