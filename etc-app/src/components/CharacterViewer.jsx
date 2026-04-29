import React, { Suspense } from 'react';
import AvatarApp from '../avatar/App';

export default function CharacterViewer({ modelPath }) {
  // If modelPath is empty or 'placeholder', we can either pass undefined 
  // or a placeholder model path if your friend has one.
  const isPlaceholder = !modelPath || modelPath === 'placeholder';
  
  // Pass the model path to your friend's Avatar System
  // If it's placeholder, we just don't load the model (or load a default one)
  const actualModelPath = isPlaceholder ? '/model/LowRes2.glb' : modelPath;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px', position: 'relative' }}>
       {/* Render your friend's entire avatar system here! */}
       <Suspense fallback={<div style={{color: 'white', padding: '20px'}}>Loading Interactive Avatar...</div>}>
         <AvatarApp modelUrl={actualModelPath} />
       </Suspense>
    </div>
  );
}
