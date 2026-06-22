# Avatar Integration Notes

The current app uses the local `avatar-model` package from `vendor/avatar-model`. The React side is intentionally thin: `src/components/CharacterViewer.jsx` mounts a canvas and delegates the Three.js scene, GLB loading, animation, lip sync, and audio playback to `createAvatarScene`.

## Runtime Flow

1. `HomeAssistant.jsx` receives a user question through text, quick prompts, or microphone input.
2. The assistant calls `/api/gpt` with ETC-specific system instructions.
3. The returned text is passed into `CharacterViewer` as `script`.
4. `CharacterViewer` calls `controller.speak(script)`.
5. The avatar package calls the provided `ttsEndpoint`, which maps to `/api/tts`.
6. Once audio is ready, `HomeAssistant` reveals the response bubble and triggers any requested navigation tag.

## Key Files

```text
src/components/HomeAssistant.jsx       # Assistant state, chat, STT, TTS, navigation tags
src/components/CharacterViewer.jsx     # Canvas wrapper and avatar loading/error UI
src/styles/components/HomeAssistant.css
src/styles/components/CharacterViewer.css
api/gpt.js                             # ETC-scoped LLM response
api/stt.js                             # Speech-to-text
api/tts.js                             # Text-to-speech
vendor/avatar-model/                   # Local avatar package
public/model/FModel2new.glb            # Assistant model used globally
```

## Usage

```jsx
<CharacterViewer
  modelPath="/model/FModel2new.glb"
  ttsEndpoint={handleTTSFetch}
  script={latestScript}
  button={false}
  modelScale={0.9}
  section="ETC Assistant Avatar"
/>
```

## Demo-Safe Behaviors

- The avatar wrapper now shows loading and error states.
- If TTS fails, the text answer is still displayed and the avatar state resets.
- Project narration buttons broadcast avatar status so the project card shows thinking/speaking feedback.
- A fallback timer reveals the text answer if the avatar voice takes too long to load.

## Adding or Replacing Models

Place the `.glb` file in `public/model/`, then update the `modelPath` prop. If the model scale or framing is off, adjust `modelScale`, `modelPosition`, and `cameraPosition` in the `CharacterViewer` call.
