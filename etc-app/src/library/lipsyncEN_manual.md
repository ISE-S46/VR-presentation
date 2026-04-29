# iClone8 GLB LipSync Library (EN)

A custom, lightweight JavaScript lipsync library tailored specifically for **iClone8** character models exported to GLB format via Blender.

This library translates text or audio into natural, fluid mouth movements. It is designed to solve common issues with iClone8 WebGL exports, specifically avoiding the unnatural "stretching" caused by overdriving the `Jaw_Open` morph target.

## Features

* **Custom iClone8 Tuning:** Calibrated specifically for iClone8 facial morphs to prevent unnatural mesh tearing.
* **Dual Resolution Support:** Ships with two `VISEME_MAP` presets — one for full-resolution models (2084×2084, all V_ morphs available) and one for reduced-resolution models (limited morph set, uses `Jaw_Open`, `Mouth_Shrug`, `Mouth_Funnel`, and `Mouth_Pucker` as substitutes).
* **Dual Modes:** Support for both **Text-Driven** (heuristic grapheme parsing) and **Audio-Driven** (Web Audio API FFT frequency-band analysis) lipsync.
* **Punctuation-Aware Pauses:** Commas, periods, and other punctuation generate real mouth-close events so the character visibly pauses between sentences.
* **Audio Sync via `startAt`:** Locks lipsync playback to a known `performance.now()` timestamp and scales all viseme timings to fit the audio duration exactly.
* **Render Loop Drift Correction:** When paired with the resync pattern in `main.js`, `_startTime` is nudged every frame against `audio.currentTime` to compensate for TTS rhythm variation.
* **No External API Required:** The text-to-viseme parser runs entirely on the client using a grapheme dictionary and heuristic timing.
* **Organic Movement:** Built-in fluid lerping between visemes and an automated idle breath animation to keep the character alive when silent.
* **Microphone Support:** Real-time FFT frequency-band analysis directly from the user's microphone.

## The Jaw Tuning Philosophy

Natively exported iClone models often look stiff or distorted on the web if you solely rely on standard viseme targets. This library uses a customized stacking approach:

* **`Jaw_Open` is a subtle assist:** Used only as a minor hinge (kept strictly between `0.05` and `0.35`). It is *not* the primary driver.
* **`Mouth_Drop_Lower` is the visual core (full-res):** This handles the actual vertical drop of the mouth geometry (Range: `0.05`–`0.65`).
* **`Mouth_Down_Lower_L/R` for realism:** Adds a natural downward pull to the corners of the mouth (Range: `0.05`–`0.35`).
* **Reduced model fallback:** When the `V_` morphs are unavailable, `Mouth_Shrug_Upper/Lower`, `Mouth_Funnel_Up/Down`, and `Mouth_Pucker` substitute for the missing drivers. `Mouth_Close` is used to seal bilabial and nasal sounds.

Combined, these morphs produce a wide, expressive, and natural jaw drop without over-extending the 3D mesh.


## Getting Started

### Prerequisites
Your 3D engine (e.g., Three.js) must pass a `morphTargets` object to the library containing:
1. `mesh`: The 3D mesh object.
2. `influences`: The array of morph target weight values.
3. `dictionary`: A key-value map linking morph target names (strings) to their array index (integers).

### Import the Library
```javascript
import { LipSync, AudioLipSync, textToVisemes } from './path/to/lipsyncEN.js';
```

---

## Usage: Text-Driven LipSync (`LipSync`)

The `LipSync` class converts plain English text strings into timed viseme events and animates the 3D mesh accordingly.

```javascript
// 1. Initialize with your mesh's morph targets
const lipSync = new LipSync(morphTargets, {
  blendSpeed: 15,
  restBlendSpeed: 12,
  idleBreath: true,
  globalScale: 1.0,
});

// 2. Speak a phrase (defaults to 130 words per minute)
lipSync.speakText("Hello world! How are you doing today?");

// 3. Update inside your rendering loop
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  lipSync.update(delta);
  renderer.render(scene, camera);
}
```

### Syncing to TTS Audio

Use `startAt` to lock lipsync to an audio element's playback. The duration argument scales all viseme timings to fit the audio length exactly.

```javascript
const audio = new Audio(url);

// Wait for metadata so duration is guaranteed — never NaN
await new Promise((resolve) => {
  audio.addEventListener('loadedmetadata', resolve, { once: true });
  audio.load();
});

const durationMs = audio.duration * 1000;
const source = ctx.createMediaElementSource(audio);
source.connect(ctx.destination);

audio.addEventListener('playing', () => {
  lipSync.startAt(performance.now(), textToSay, durationMs);
  currentAudio = audio; // store ref for render loop resync
}, { once: true });

audio.addEventListener('ended', () => {
  currentAudio = null;
  lipSync.stop();
  URL.revokeObjectURL(url);
}, { once: true });

await audio.play();
```

### Render Loop Drift Correction

TTS providers don't guarantee uniform speech rhythm, so the lipsync cursor can drift from the actual audio position. Add this resync block at the top of your render loop to correct it gently every frame:

```javascript
// currentAudio is the currently playing Audio element (or null)
if (currentAudio && !currentAudio.paused && lipSync.isPlaying) {
  const audioElapsedMs   = currentAudio.currentTime * 1000;
  const lipSyncElapsedMs = performance.now() - lipSync._startTime;
  const drift            = lipSyncElapsedMs - audioElapsedMs;

  // Correct only noticeable drift (>20ms) to avoid per-frame jitter
  if (Math.abs(drift) > 20) {
    lipSync._startTime += drift * 0.15; // closes 15% of gap per frame (~20 frames to fully sync)
  }
}
```

---

## Usage: Audio-Driven LipSync (`AudioLipSync`)

The `AudioLipSync` class uses the Web Audio API's FFT analyser to split audio into bass, mid, and high frequency bands and drive different mouth shapes from each band in real time. Great for real-time voice chat or pre-recorded audio playback.

**Band mapping:**
| Band | Bin range | Frequency | Drives |
|---|---|---|---|
| Bass | 1–12 | ~172 Hz–2 kHz | `Jaw_Open`, open vowel shapes (aa/oh) |
| Mid | 13–35 | ~2–6 kHz | `Mouth_Smile`, wide shapes (E/ih) |
| High | 36–80 | ~6–13.7 kHz | `Mouth_Pucker`, fricative shapes (FF/SS/CH) |

### Using an HTML `<audio>` Element

```javascript
const audioLipSync = new AudioLipSync(morphTargets, {
  smoothing: 0.6,
  gain: 3.5,
  blendSpeed: 20,
  restBlendSpeed: 15,
});

const audioElement = document.getElementById('myAudio');
await audioLipSync.fromAudioElement(audioElement);
audioLipSync.start();

// In your render loop:
audioLipSync.update(delta);
```

### Using Microphone Input

```javascript
const micLipSync = new AudioLipSync(morphTargets);
await micLipSync.fromMicrophone();
micLipSync.start();

// In your render loop:
micLipSync.update(delta);
```

### Switching Between Text and Audio LipSync

Since both classes write to the same morph influences, only one should update per frame. Use a guard in your render loop:

```javascript
if (audioLipSync && audioLipSync._running) {
  audioLipSync.update(delta); // audio/mic mode
} else if (lipSync) {
  lipSync.update(delta);      // text mode + idle breath
}
```

---

## Punctuation Pauses

`textToVisemes` generates explicit `sil` events for punctuation with the following durations. Events longer than 80 ms cause the mouth to visibly close in `update()`.

| Character | Duration |
|---|---|
| `.` `!` `?` | 380–400 ms |
| `;` | 220 ms |
| `,` `:` | 180 ms |
| `-` | 120 ms |
| ` ` (space) | ≤60 ms (mouth stays open) |

---

## Model Compatibility

### Full-Resolution Model (2084×2084)
Uses the commented-out `VISEME_MAP` block at the top of the file. Requires these morphs to be present:
`V_Open`, `V_Lip_Open`, `V_Wide`, `V_Tight`, `V_Tight_O`, `V_Affricate`, `V_Dental_Lip`, `V_Explosive`, `Mouth_Drop_Upper`, `Mouth_Drop_Lower`, `Mouth_Down`, `Mouth_Up`.

### Reduced-Resolution Model
Uses the active `VISEME_MAP`. Works with the morph set confirmed on the low-res iClone8 export:
`Jaw_Open`, `Mouth_Shrug_Upper/Lower`, `Mouth_Down_Lower_L/R`, `Mouth_Up_Upper_L/R`, `Mouth_Funnel_Up/Down_L/R`, `Mouth_Pucker_Up/Down_L/R`, `Mouth_Smile_L/R`, `Mouth_Stretch_L/R`, `Mouth_Press_L/R`, `Mouth_Close`.

To switch presets, uncomment the full-res block and comment out the reduced block (clearly marked in the source file).

---

## API Reference

### `class LipSync`

**Constructor options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `blendSpeed` | Number | 15 | Lerp speed toward a viseme target |
| `restBlendSpeed` | Number | 12 | Lerp speed back to rest/silence |
| `idleBreath` | Boolean | true | Subtle sine-wave mouth animation when not speaking |
| `globalScale` | Number | 1.0 | Multiplier for all viseme weights. Values > 1 exaggerate movement |

**Methods:**

| Method | Description |
|---|---|
| `.speakText(text, [wpm=130])` | Parse text and begin playback at the given words-per-minute |
| `.play(events)` | Play a pre-built array of `{ time, viseme, duration }` events |
| `.startAt(startTime, text, [durationMs], [wpm=130])` | Schedule playback anchored to a `performance.now()` timestamp. Pass `durationMs` to scale timing to match audio length |
| `.stop()` | Halt playback and blend mouth back to rest |
| `.update(delta)` | Call every frame with seconds since last frame |
| `.isPlaying` | Getter — `true` if currently speaking |
| `.totalDuration` | Getter — total length of current event sequence in ms |

### `class AudioLipSync`

**Constructor options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `smoothing` | Number | 0.6 | Web Audio `smoothingTimeConstant`. Higher = less jitter, slower reaction |
| `gain` | Number | 2.5 | Amplitude multiplier. Increase if quiet audio doesn't open the mouth |
| `blendSpeed` | Number | 20 | Lerp speed for mouth opening |
| `restBlendSpeed` | Number | 15 | Lerp speed for mouth closing |

**Methods:**

| Method | Description |
|---|---|
| `.fromAudioElement(el)` | Connect analyser to an `<audio>` element |
| `.fromMicrophone()` | Request mic access and connect the stream |
| `.start()` / `.stop()` | Toggle audio analysis on/off |
| `.update(delta)` | Call every frame to analyse and apply morphs |

### `textToVisemes(text, wordsPerMinute)`

Standalone utility. Converts plain English text to a timed viseme event array.

**Returns:** `Array<{ time: number, viseme: string, duration: number }>`

Useful if you need the raw events for custom playback, logging, or passing to an external system.