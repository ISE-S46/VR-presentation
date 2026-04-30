# Avatar System Integration Notes

Documentation for integrating the 3D Avatar system (from the `threejs-test` folder) into the `etc-app` project.

## 1. Code Migration
- **Created `src/avatar/` folder**: Moved all code from `threejs-test/src/` into this folder to separate avatar functionality from the main web UI
- **Asset migration**: Copied `threejs-test/public/` folder to `etc-app/public/` (including 3D model files like `LowRes.glb` and audio folders)
- **Library migration**: Copied `library/` folder (containing the LipSync system) to `etc-app/src/library/` to prevent path resolution errors

## 2. System Refactoring
- **Modified `useCharacter.ts` and `useCharacterLoader.ts`**: Restored `modelUrl` parameter acceptance (previously hardcoded by teammate) to support different models on different pages
- **Updated `App.tsx` (in avatar folder)**: Changed component to accept `{ modelUrl }` props and pass them to the model loading system
- **Enhanced `CharacterViewer.jsx`**: Removed placeholder robot code and wrapped with `<Suspense>` to directly use `AvatarApp` (teammate's system)

## 3. UI and Visual Adjustments
- **Transparent Background**:
  - Modified `src/avatar/styles/app.css` by removing `background-color: #121212;` from body to avoid overriding the webpage background
  - Updated `src/avatar/core/renderer.ts` by setting `alpha: true` for `WebGLRenderer` to make the 3D area transparent (like PNG files)
- **Container Fitting**:
  - Modified `app.css` changed `position: fixed;` and `100vw`/`100vh` to `position: absolute;` and `width: 100%; height: 100%;` so the 3D model doesn't cover the full screen but stays within its designated `<div>`
  - Updated resize system in `renderer.ts` to calculate size from `parentElement` instead of `window` dimensions
- **Page Placement**:
  - Removed `CharacterViewer` from **Interactive Q&A** page (`QnA.jsx`) to use regular `VRPlaceholder`
  - Kept `CharacterViewer` on **Landing Page** centered on the page (per latest requirements)
- **Microphone Button (Minimal UI)**:
  - Modified `src/avatar/components/speakButton.tsx`
  - Created a glassmorphism microphone button positioned at the bottom center of the character
  - When clicked, the character speaks the provided script immediately

## Current Avatar System Architecture

The avatar system is now a complete TypeScript-based 3D character system:

```
src/avatar/
├── App.tsx                    ← Main avatar component entry point
├── main.tsx                   ← Avatar system entry point
├── components/                ← React components for avatar UI
│   ├── sceneCanvas.tsx        ← Three.js canvas wrapper
│   ├── speakButton.tsx        ← Microphone/speak button
│   ├── speechControls.tsx     ← Speech control interface
│   └── localSpeeches.tsx      ← Preset speech options
├── core/                      ← Three.js core systems
│   ├── renderer.ts            ← Scene, camera, renderer setup
│   └── controls.ts            ← Orbit controls
├── hooks/                     ← React hooks for avatar logic
│   ├── useCharacter.ts        ← Main character management
│   ├── useCharacterLoader.ts  ← GLB model loading
│   ├── useScene.ts            ← Three.js scene management
│   ├── useSpeak.ts            ← TTS integration
│   └── useLocalSpeak.ts       ← Audio file playback
├── context/                   ← React context for state
│   └── characterContext.ts    ← Character state management
├── service/                   ← External services
│   └── tts.ts                 ← Text-to-speech service
├── types/                     ← TypeScript definitions
│   ├── characters.type.ts     ← Character-related types
│   └── lipsync.d.ts           ← Lip sync type definitions
├── world/                     ← 3D environment
│   └── light.ts               ← Lighting setup
└── styles/                    ← Avatar-specific styles
    └── app.css                ← Avatar component styles
```

## Key Features
- **GLB Model Loading**: Supports any GLB 3D model file
- **Lip Sync Animation**: Real-time mouth animation synchronized with speech
- **Text-to-Speech**: Integrated TTS service for dynamic speech
- **Audio Playback**: Support for pre-recorded audio files
- **Orbit Controls**: Mouse/touch controls for camera movement (can be disabled)
- **Responsive Design**: Adapts to container size changes
- **Transparent Background**: Integrates seamlessly with web page backgrounds

## Usage in Pages

To use the avatar in any page, import and use `CharacterViewer`:

```jsx
import CharacterViewer from '../components/CharacterViewer';

function MyPage() {
  return (
    <div>
      <CharacterViewer
        modelPath="/model/FModel1.glb"
        audioUrl="/audio/ETC-landing.mp3"
        script="Welcome message here..."
        scale={1.2}
        position={[0, -1, 0]}
      />
    </div>
  );
}
```

## Future Model Integration

When teammate creates new models, simply place the `.glb` file in `public/model/` and update the `modelPath` prop:

```jsx
<CharacterViewer modelPath="/model/NewModel.glb" />
```

The system will automatically load and display the new 3D model with all existing features (lip sync, speech, controls, etc.).
