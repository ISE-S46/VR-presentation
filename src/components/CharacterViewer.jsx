import React, { Suspense } from 'react';
import AvatarApp from '../avatar/App';
import '../styles/components/CharacterViewer.css';

export default function CharacterViewer({ modelPath, audioURL, script, section = "Interactive Avatar", children, ...threeProps }) {
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
        >
          {children}
        </AvatarApp>
      </Suspense>
    </div>
  );
}