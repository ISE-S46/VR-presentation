/**
 * lipsync.js
 * Custom lipsync library for iClone8 GLB models converted via Blender.
 *
 * Primary mouth-open drivers confirmed for this model:
 *   Mouth_Drop_Upper, Mouth_Drop_Lower, Mouth_Down_Lower_L/R, Jaw_Open
 *
 * Jaw tuning philosophy:
 *   - Jaw_Open is a subtle hinge assist, NOT the main driver. Keep it low (0.05–0.35).
 *   - Mouth_Drop_Lower is the real lower-jaw visual. Range: 0.05–0.65.
 *   - Mouth_Down_Lower_L/R add natural corner pull. Range: 0.05–0.35.
 *   - Together they produce a natural jaw drop without over-extending.
 *
 * Usage:
 *   import { LipSync } from './library/lipsyncEN.js';
 *   const lipSync = new LipSync(morphTargets);
 *   lipSync.speakText("Hello world");
 *   // in render loop:
 *   lipSync.update(delta);
 *   lipSync.stop();
 */

// ---------------------------------------------------------------------------
// VISEME → MORPH TARGET MAP
// ---------------------------------------------------------------------------

// For full model resolution (2084x2084) uncommented this and comment out the reduced version below. For testing and performance, the reduced version is tuned to use fewer morphs while still capturing the essence of each viseme. Adjust as needed for your specific model and performance requirements.
// export const VISEME_MAP = {

//   sil: {},

//   PP: {
//     Mouth_Press_L: 0.8,
//     Mouth_Press_R: 0.8,
//     V_Explosive: 0.8,
//     Mouth_Drop_Upper: 0.02,
//     Mouth_Drop_Lower: 0.02,
//     Mouth_Down_Lower_L: 0.02,
//     Mouth_Down_Lower_R: 0.02,
//     Jaw_Open: 0.02,
//     V_Lip_Open: 0.02, // sealed, nearly no lip opening
//     V_Affricate: 0.05, // lips building pressure before release
//   },

//   FF: {
//     V_Dental_Lip: 0.9,
//     Mouth_Drop_Upper: 0.1,
//     Mouth_Drop_Lower: 0.2,
//     Mouth_Down_Lower_L: 0.08,
//     Mouth_Down_Lower_R: 0.08,
//     Mouth_Up: 0.15,
//     Jaw_Open: 0.1,
//     V_Lip_Open: 0.15, // small gap for the labiodental
//     V_Affricate: 0.2,  // labiodental constriction
//   },

//   TH: {
//     V_Dental_Lip: 0.6,
//     Mouth_Drop_Upper: 0.15,
//     Mouth_Drop_Lower: 0.25,
//     Mouth_Down_Lower_L: 0.1,
//     Mouth_Down_Lower_R: 0.1,
//     Jaw_Open: 0.15,
//     V_Lip_Open: 0.2,  // tongue pushes lips apart slightly
//     V_Affricate: 0.15, // dental constriction similar to affricate
//   },

//   DD: {
//     V_Explosive: 0.5,
//     Mouth_Drop_Upper: 0.2,
//     Mouth_Drop_Lower: 0.3,
//     Mouth_Down_Lower_L: 0.12,
//     Mouth_Down_Lower_R: 0.12,
//     Mouth_Down: 0.1,
//     Jaw_Open: 0.18,
//     V_Lip_Open: 0.25,
//     V_Affricate: 0.1,  // slight stop release
//   },

//   kk: {
//     V_Tight_O: 0.45,
//     Mouth_Drop_Upper: 0.22,
//     Mouth_Drop_Lower: 0.35,
//     Mouth_Down_Lower_L: 0.15,
//     Mouth_Down_Lower_R: 0.15,
//     Mouth_Down: 0.12,
//     Jaw_Open: 0.22,
//     V_Lip_Open: 0.28,
//   },

//   CH: {
//     V_Affricate: 0.8,
//     Mouth_Pucker_Up_L: 0.35,
//     Mouth_Pucker_Up_R: 0.35,
//     Mouth_Pucker_Down_L: 0.35,
//     Mouth_Pucker_Down_R: 0.35,
//     Mouth_Drop_Upper: 0.18,
//     Mouth_Drop_Lower: 0.3,
//     Mouth_Down_Lower_L: 0.12,
//     Mouth_Down_Lower_R: 0.12,
//     Mouth_Down: 0.1,
//     Jaw_Open: 0.18,
//     V_Lip_Open: 0.22, // rounded aperture
//   },

//   SS: {
//     V_Tight: 0.7,
//     Mouth_Smile_L: 0.2,
//     Mouth_Smile_R: 0.2,
//     Mouth_Drop_Upper: 0.12,
//     Mouth_Drop_Lower: 0.2,
//     Mouth_Down_Lower_L: 0.08,
//     Mouth_Down_Lower_R: 0.08,
//     Jaw_Open: 0.1,
//     V_Lip_Open: 0.12, // tight sibilant, barely open
//     V_Affricate: 0.35, // sibilant shares affricate lip shape
//   },

//   nn: {
//     V_Dental_Lip: 0.3,
//     Mouth_Drop_Upper: 0.06,
//     Mouth_Drop_Lower: 0.1,
//     Mouth_Down_Lower_L: 0.04,
//     Mouth_Down_Lower_R: 0.04,
//     Jaw_Open: 0.06,
//     V_Lip_Open: 0.06, // nasal, almost sealed
//   },

//   RR: {
//     V_Tight_O: 0.5,
//     Mouth_Pucker_Up_L: 0.38,
//     Mouth_Pucker_Up_R: 0.38,
//     Mouth_Pucker_Down_L: 0.35,
//     Mouth_Pucker_Down_R: 0.35,
//     Mouth_Drop_Upper: 0.15,
//     Mouth_Drop_Lower: 0.28,
//     Mouth_Down_Lower_L: 0.1,
//     Mouth_Down_Lower_R: 0.1,
//     Mouth_Down: 0.1,
//     Jaw_Open: 0.16,
//     V_Lip_Open: 0.3,  // rhotic has a visible lip aperture
//     V_Affricate: 0.15, // rhotic has mild constriction
//   },

//   aa: {
//     V_Open: 0.85,
//     Mouth_Drop_Upper: 0.5,
//     Mouth_Drop_Lower: 0.65,
//     Mouth_Down: 0.3,
//     Mouth_Up: 0.25,
//     Mouth_Up_Upper_L: 0.2,
//     Mouth_Up_Upper_R: 0.2,
//     Mouth_Down_Lower_L: 0.3,
//     Mouth_Down_Lower_R: 0.3,
//     Mouth_Shrug_Upper: 0.12,
//     Mouth_Shrug_Lower: 0.12,
//     Jaw_Open: 0.35,
//     V_Lip_Open: 0.7,  // widest open vowel
//   },

//   E: {
//     V_Wide: 0.75,
//     Mouth_Drop_Upper: 0.38,
//     Mouth_Drop_Lower: 0.52,
//     Mouth_Down: 0.25,
//     Mouth_Up: 0.2,
//     Mouth_Up_Upper_L: 0.15,
//     Mouth_Up_Upper_R: 0.15,
//     Mouth_Down_Lower_L: 0.22,
//     Mouth_Down_Lower_R: 0.22,
//     Mouth_Smile_L: 0.3,
//     Mouth_Smile_R: 0.3,
//     Jaw_Open: 0.28,
//     V_Lip_Open: 0.55, // wide smile aperture
//   },

//   ih: {
//     V_Wide: 0.55,
//     Mouth_Drop_Upper: 0.22,
//     Mouth_Drop_Lower: 0.35,
//     Mouth_Down: 0.15,
//     Mouth_Up_Upper_L: 0.08,
//     Mouth_Up_Upper_R: 0.08,
//     Mouth_Down_Lower_L: 0.14,
//     Mouth_Down_Lower_R: 0.14,
//     Mouth_Smile_L: 0.15,
//     Mouth_Smile_R: 0.15,
//     Jaw_Open: 0.2,
//     V_Lip_Open: 0.38, // relaxed short vowel
//   },

//   oh: {
//     V_Tight_O: 0.75,
//     Mouth_Drop_Upper: 0.38,
//     Mouth_Drop_Lower: 0.52,
//     Mouth_Down: 0.28,
//     Mouth_Down_Lower_L: 0.22,
//     Mouth_Down_Lower_R: 0.22,
//     Mouth_Funnel_Up_L: 0.28,
//     Mouth_Funnel_Up_R: 0.28,
//     Mouth_Funnel_Down_L: 0.28,
//     Mouth_Funnel_Down_R: 0.28,
//     Jaw_Open: 0.3,
//     V_Lip_Open: 0.5,  // rounded open
//   },

//   ou: {
//     V_Tight_O: 0.65,
//     Mouth_Pucker_Up_L: 0.55,
//     Mouth_Pucker_Up_R: 0.55,
//     Mouth_Pucker_Down_L: 0.48,
//     Mouth_Pucker_Down_R: 0.48,
//     Mouth_Drop_Upper: 0.22,
//     Mouth_Drop_Lower: 0.35,
//     Mouth_Down_Lower_L: 0.14,
//     Mouth_Down_Lower_R: 0.14,
//     Mouth_Down: 0.15,
//     Jaw_Open: 0.2,
//     V_Lip_Open: 0.45, // pursed but still open
//   },

//   // uu already had V_Lip_Open as a primary driver — kept and tuned
//   uu: {
//     V_Lip_Open: 0.55,
//     Mouth_Pucker_Up_L: 0.4,
//     Mouth_Pucker_Up_R: 0.4,
//     Mouth_Pucker_Down_L: 0.35,
//     Mouth_Pucker_Down_R: 0.35,
//     Mouth_Drop_Upper: 0.16,
//     Mouth_Drop_Lower: 0.28,
//     Mouth_Down_Lower_L: 0.1,
//     Mouth_Down_Lower_R: 0.1,
//     Jaw_Open: 0.16,
//   },
// };

export const VISEME_MAP = {

  sil: {},

  // PP — bilabial (soft seal, never clamp)
  PP: {
    Mouth_Press_L: 0.35,
    Mouth_Press_R: 0.35,
    Mouth_Close: 0.25,
    Jaw_Open: 0.08,
    Mouth_Down_Lower_L: 0.02,
    Mouth_Down_Lower_R: 0.02,
  },

  // FF — labiodental
  FF: {
    Mouth_Shrug_Upper: 0.35,
    Mouth_Up_Upper_L: 0.2,
    Mouth_Up_Upper_R: 0.2,
    Mouth_Funnel_Up_L: 0.15,
    Mouth_Funnel_Up_R: 0.15,
    Jaw_Open: 0.12,
    Mouth_Down_Lower_L: 0.08,
    Mouth_Down_Lower_R: 0.08,
  },

  // TH — dental
  TH: {
    Mouth_Shrug_Upper: 0.25,
    Mouth_Up_Upper_L: 0.12,
    Mouth_Up_Upper_R: 0.12,
    Jaw_Open: 0.22,
    Mouth_Down_Lower_L: 0.1,
    Mouth_Down_Lower_R: 0.1,
    Mouth_Shrug_Lower: 0.08,
  },

  // DD — alveolar
  DD: {
    Jaw_Open: 0.3,
    Mouth_Shrug_Upper: 0.18,
    Mouth_Shrug_Lower: 0.12,
    Mouth_Down_Lower_L: 0.14,
    Mouth_Down_Lower_R: 0.14,
    Mouth_Up_Upper_L: 0.08,
    Mouth_Up_Upper_R: 0.08,
  },

  // kk — velar
  kk: {
    Jaw_Open: 0.38,
    Mouth_Shrug_Upper: 0.22,
    Mouth_Shrug_Lower: 0.18,
    Mouth_Down_Lower_L: 0.18,
    Mouth_Down_Lower_R: 0.18,
    Mouth_Up_Upper_L: 0.1,
    Mouth_Up_Upper_R: 0.1,
  },

  // CH — affricate (balanced pucker/funnel)
  CH: {
    Mouth_Pucker_Up_L: 0.3,
    Mouth_Pucker_Up_R: 0.3,
    Mouth_Pucker_Down_L: 0.28,
    Mouth_Pucker_Down_R: 0.28,
    Mouth_Funnel_Up_L: 0.18,
    Mouth_Funnel_Up_R: 0.18,
    Mouth_Funnel_Down_L: 0.18,
    Mouth_Funnel_Down_R: 0.18,
    Jaw_Open: 0.22,
    Mouth_Down_Lower_L: 0.1,
    Mouth_Down_Lower_R: 0.1,
  },

  // SS — sibilant (don't clamp)
  SS: {
    Mouth_Smile_L: 0.25,
    Mouth_Smile_R: 0.25,
    Mouth_Stretch_L: 0.2,
    Mouth_Stretch_R: 0.2,
    Jaw_Open: 0.15,
    Mouth_Down_Lower_L: 0.08,
    Mouth_Down_Lower_R: 0.08,
    Mouth_Close: 0.08,
  },

  // nn — nasal (soft close)
  nn: {
    Mouth_Close: 0.25,
    Jaw_Open: 0.08,
    Mouth_Down_Lower_L: 0.04,
    Mouth_Down_Lower_R: 0.04,
    Mouth_Shrug_Lower: 0.06,
  },

  // RR — rhotic
  RR: {
    Mouth_Pucker_Up_L: 0.3,
    Mouth_Pucker_Up_R: 0.3,
    Mouth_Pucker_Down_L: 0.28,
    Mouth_Pucker_Down_R: 0.28,
    Jaw_Open: 0.22,
    Mouth_Down_Lower_L: 0.12,
    Mouth_Down_Lower_R: 0.12,
    Mouth_Shrug_Lower: 0.08,
  },

  // aa — open vowel
  aa: {
    Jaw_Open: 0.65,
    Mouth_Shrug_Upper: 0.3,
    Mouth_Shrug_Lower: 0.25,
    Mouth_Down_Lower_L: 0.32,
    Mouth_Down_Lower_R: 0.32,
    Mouth_Up_Upper_L: 0.18,
    Mouth_Up_Upper_R: 0.18,
    Mouth_Funnel_Up_L: 0.12,
    Mouth_Funnel_Up_R: 0.12,
    Mouth_Funnel_Down_L: 0.12,
    Mouth_Funnel_Down_R: 0.12,
  },

  // E — smile vowel
  E: {
    Jaw_Open: 0.42,
    Mouth_Smile_L: 0.35,
    Mouth_Smile_R: 0.35,
    Mouth_Stretch_L: 0.18,
    Mouth_Stretch_R: 0.18,
    Mouth_Shrug_Upper: 0.22,
    Mouth_Shrug_Lower: 0.18,
    Mouth_Down_Lower_L: 0.2,
    Mouth_Down_Lower_R: 0.2,
    Mouth_Up_Upper_L: 0.12,
    Mouth_Up_Upper_R: 0.12,
  },

  // ih — relaxed vowel
  ih: {
    Jaw_Open: 0.3,
    Mouth_Smile_L: 0.18,
    Mouth_Smile_R: 0.18,
    Mouth_Shrug_Upper: 0.12,
    Mouth_Shrug_Lower: 0.1,
    Mouth_Down_Lower_L: 0.12,
    Mouth_Down_Lower_R: 0.12,
    Mouth_Up_Upper_L: 0.06,
    Mouth_Up_Upper_R: 0.06,
  },

  // oh — rounded open
  oh: {
    Jaw_Open: 0.5,
    Mouth_Pucker_Up_L: 0.25,
    Mouth_Pucker_Up_R: 0.25,
    Mouth_Pucker_Down_L: 0.22,
    Mouth_Pucker_Down_R: 0.22,
    Mouth_Funnel_Up_L: 0.3,
    Mouth_Funnel_Up_R: 0.3,
    Mouth_Funnel_Down_L: 0.3,
    Mouth_Funnel_Down_R: 0.3,
    Mouth_Shrug_Upper: 0.18,
    Mouth_Shrug_Lower: 0.15,
    Mouth_Down_Lower_L: 0.22,
    Mouth_Down_Lower_R: 0.22,
  },

  // ou — tighter rounded
  ou: {
    Jaw_Open: 0.28,
    Mouth_Pucker_Up_L: 0.45,
    Mouth_Pucker_Up_R: 0.45,
    Mouth_Pucker_Down_L: 0.42,
    Mouth_Pucker_Down_R: 0.42,
    Mouth_Funnel_Up_L: 0.18,
    Mouth_Funnel_Up_R: 0.18,
    Mouth_Funnel_Down_L: 0.18,
    Mouth_Funnel_Down_R: 0.18,
    Mouth_Down_Lower_L: 0.12,
    Mouth_Down_Lower_R: 0.12,
  },

  // uu — closed rounded
  uu: {
    Jaw_Open: 0.2,
    Mouth_Pucker_Up_L: 0.4,
    Mouth_Pucker_Up_R: 0.4,
    Mouth_Pucker_Down_L: 0.38,
    Mouth_Pucker_Down_R: 0.38,
    Mouth_Funnel_Up_L: 0.12,
    Mouth_Funnel_Up_R: 0.12,
    Mouth_Funnel_Down_L: 0.12,
    Mouth_Funnel_Down_R: 0.12,
    Mouth_Down_Lower_L: 0.08,
    Mouth_Down_Lower_R: 0.08,
  },
};

// ---------------------------------------------------------------------------
// PHONEME → VISEME  (English CMU phoneme set)
// ---------------------------------------------------------------------------

export const PHONEME_TO_VISEME = {
  SP: 'sil', SIL: 'sil', '': 'sil',
  P: 'PP', B: 'PP', M: 'PP',
  F: 'FF', V: 'FF',
  TH: 'TH', DH: 'TH',
  T: 'DD', D: 'DD', N: 'DD', L: 'DD',
  K: 'kk', G: 'kk', NG: 'nn',
  CH: 'CH', JH: 'CH', SH: 'CH', ZH: 'CH',
  S: 'SS', Z: 'SS',
  HH: 'sil',
  W: 'ou', R: 'RR', Y: 'ih',
  AA: 'aa', AH: 'aa', AE: 'aa',
  EH: 'E', EY: 'E', IY: 'ih', IH: 'ih',
  AO: 'oh', OW: 'oh', OY: 'oh',
  UW: 'ou', UH: 'uu',
  AW: 'aa', AY: 'aa', ER: 'RR',
};

// ---------------------------------------------------------------------------
// TEXT → VISEME EVENTS
// ---------------------------------------------------------------------------

const DIGRAPHS = {
  sh: 'CH', ch: 'CH', th: 'TH', ph: 'FF',
  wh: 'ou', ng: 'nn', gh: 'sil', ck: 'kk', qu: 'kk',
};

const GRAPHEME_MAP = {
  p: 'PP', b: 'PP', m: 'PP',
  f: 'FF', v: 'FF',
  t: 'DD', d: 'DD', n: 'DD', l: 'DD',
  k: 'kk', g: 'kk', c: 'kk', q: 'kk', x: 'kk',
  s: 'SS', z: 'SS',
  r: 'RR',
  w: 'ou',
  y: 'ih',
  h: 'sil',
  j: 'CH',
  a: 'aa', e: 'E', i: 'ih', o: 'oh', u: 'uu',
  ' ': 'sil', ',': 'sil', '.': 'sil',
  '!': 'sil', '?': 'sil', '-': 'sil',
};

// Pause durations by punctuation type (ms).
// These are long enough to exceed the 80ms gap threshold in update(),
// which causes the mouth to visibly close during punctuation pauses.
const PUNCTUATION_PAUSE = {
  '.': 388,  // full stop — clear pause
  '!': 380,
  '?': 380,
  ',': 180,  // comma — brief pause
  ';': 220,
  ':': 180,
  '-': 120,
  // ' ' handled separately — very short word boundary, not a real pause
};

export function textToVisemes(text, wordsPerMinute = 130) {
  const msPerChar = (60 / wordsPerMinute / 5) * 1000;

  const lower = text.toLowerCase();
  const events = [];
  let cursor = 0;
  let i = 0;

  while (i < lower.length) {
    const digraph = lower.slice(i, i + 2);
    let viseme, charLen, duration;

    if (DIGRAPHS[digraph]) {
      viseme = DIGRAPHS[digraph];
      charLen = 2;
      duration = msPerChar * charLen;
    } else {
      const ch = lower[i];
      charLen = 1;

      if (ch in PUNCTUATION_PAUSE) {
        // Punctuation → explicit sil with meaningful duration so mouth closes
        viseme = 'sil';
        duration = PUNCTUATION_PAUSE[ch];
      } else if (ch === ' ') {
        // Space → very short sil, just a word boundary — below 80ms gap threshold
        // so mouth won't close between every word
        viseme = 'sil';
        duration = Math.min(msPerChar, 60);
      } else {
        viseme = GRAPHEME_MAP[ch] ?? 'sil';
        duration = msPerChar;
      }
    }

    // Open vowels linger slightly longer for visual clarity
    if (viseme !== 'sil' && ['aa', 'E', 'oh', 'ou'].includes(viseme)) {
      duration *= 1.3;
    }

    // Merge consecutive identical visemes to avoid micro-stuttering,
    // but NEVER merge sil events — each pause keeps its own duration intact.
    // For consecutive spaces, keep the longer duration (punctuation wins over space).
    const last = events[events.length - 1];
    if (last && last.viseme === viseme && viseme !== 'sil') {
      last.duration += duration;
    } else if (last && last.viseme === 'sil' && viseme === 'sil') {
      last.duration = Math.max(last.duration, duration);
    } else {
      events.push({ time: cursor, viseme, duration });
    }

    cursor += duration;
    i += charLen;
  }

  return events;
}

// ---------------------------------------------------------------------------
// LIPSYNC CLASS
// ---------------------------------------------------------------------------

export class LipSync {
  /**
   * @param {{ mesh, influences, dictionary }} morphTargets  — from loader.js
   * @param {object}  [options]
   * @param {number}  [options.blendSpeed=15]      lerp speed toward target
   * @param {number}  [options.restBlendSpeed=12]  lerp speed back to rest
   * @param {boolean} [options.idleBreath=true]    subtle breath when silent
   * @param {number}  [options.globalScale=1.0]    multiply all weights (>1 = more exaggerated)
   */
  constructor(morphTargets, options = {}) {
    if (!morphTargets) throw new Error('[LipSync] morphTargets is required.');

    this.mesh = morphTargets.mesh;
    this.influences = morphTargets.influences;
    this.dictionary = morphTargets.dictionary;

    this.blendSpeed = options.blendSpeed ?? 15;
    this.restBlendSpeed = options.restBlendSpeed ?? 12;
    this.idleBreath = options.idleBreath ?? true;
    this.globalScale = options.globalScale ?? 1.0;

    this._active = false;
    this._events = [];
    this._startTime = 0;
    this._currentTargets = {};
    this._breathPhase = 0;

    // Running event index for O(1) lookup instead of O(n) reverse scan.
    // Advances forward as time progresses; reset on every play/startAt call.
    this._eventIndex = 0;

    this._available = new Set(Object.keys(this.dictionary));

    this._allDrivenMorphs = new Set();
    Object.values(VISEME_MAP).forEach(weights => {
      Object.keys(weights).forEach(name => this._allDrivenMorphs.add(name));
    });

    this._rest = {};
    this._allDrivenMorphs.forEach(k => { this._rest[k] = 0; });
  }

  // Reset _eventIndex so the advancing-index scan always starts from
  // the beginning of the new event list.
  play(events) {
    this._events = events.slice().sort((a, b) => a.time - b.time);
    this._startTime = performance.now();
    this._eventIndex = 0;
    this._active = true;
  }

  speakText(text, wordsPerMinute = 130) {
    this.play(textToVisemes(text, wordsPerMinute));
  }

  /**
   * Schedule lipsync to start at a specific performance.now() timestamp.
   * Useful for syncing to audio playback that starts at a known time.
   * @param {number} startTime   performance.now() value when speech should begin
   * @param {string} text        text to speak
   * @param {number} [duration]  optional override total duration in ms (stretches/compresses timing)
   * @param {number} [wordsPerMinute=130]
   */
  // Reset _eventIndex here too — startAt replaces the event list entirely.
  startAt(startTime, text, duration = null, wordsPerMinute = 130) {
    let events = textToVisemes(text, wordsPerMinute);

    // If a target duration is provided, scale all event times and durations proportionally
    if (duration !== null && duration > 0) {
      const naturalDuration = events.reduce((max, ev) => Math.max(max, ev.time + ev.duration), 0);
      if (naturalDuration > 0) {
        const scale = duration / naturalDuration;
        events = events.map(ev => ({
          viseme: ev.viseme,
          time: ev.time * scale,
          duration: ev.duration * scale,
        }));
      }
    }

    this._events = events.slice().sort((a, b) => a.time - b.time);
    this._startTime = startTime;
    this._eventIndex = 0;
    this._active = true;
  }

  stop() {
    this._active = false;
    this._events = [];
    this._eventIndex = 0;
    this._currentTargets = { ...this._rest };
  }

  get isPlaying() { return this._active; }

  get totalDuration() {
    if (!this._events.length) return 0;
    const last = this._events[this._events.length - 1];
    return last.time + last.duration;
  }

  update(delta) {
    const elapsed = performance.now() - this._startTime;

    if (this._active) {
      const ev = this._getCurrentEvent(elapsed);

      if (ev) {
        // Active viseme — drive toward it.
        // sil events are explicit pauses: return to rest so mouth visibly closes.
        this._currentTargets = ev.viseme === 'sil'
          ? { ...this._rest }
          : this._buildTargets(ev.viseme);
      } else if (elapsed > this.totalDuration) {
        this._active = false;
        this._currentTargets = { ...this._rest };
      } else {
        // Gap between events — check how long until the next one.
        // If gap > 80ms, return to rest (visible pause).
        // If gap < 80ms, hold previous shape (avoids micro-flicker between visemes).
        const nextEv = this._getNextEvent(elapsed);
        const gapMs = nextEv ? (nextEv.time - elapsed) : Infinity;

        if (gapMs > 80) {
          this._currentTargets = { ...this._rest };
        }
      }
    } else {
      this._currentTargets = { ...this._rest };
    }

    this._applyMorphs(delta);

    if (this.idleBreath && !this._active) {
      this._applyIdleBreath(delta);
    }
  }

  /**
   * FIX: O(1) amortised event lookup.
   *
   * Old approach: O(n) reverse scan on every frame — scanned the entire event
   * array backward from the end every rAF tick.
   *
   * New approach: advance a persistent index forward as elapsed time grows.
   * Because events are sorted ascending by time and playback only moves
   * forward, _eventIndex never needs to go backward. Each event is "passed"
   * at most once, making the total cost O(n) over the whole clip rather than
   * O(n) per frame.
   *
   * Edge case — drift correction in useCharacter.ts can shift _startTime
   * backward by a small amount (up to ~3ms per correction). This can make
   * elapsed briefly decrease. To handle this without resetting the whole
   * index, we allow a one-event rollback: if the current index's start time
   * is ahead of elapsed, step back once. The drift correction is capped at
   * 0.15 * 20ms = 3ms per correction tick, so a single-step rollback is
   * always sufficient.
   */
  _getCurrentEvent(elapsed) {
    const evs = this._events;
    if (!evs.length) return null;

    // Roll back one step if drift correction moved elapsed slightly backward
    if (
      this._eventIndex > 0 &&
      elapsed < evs[this._eventIndex].time
    ) {
      this._eventIndex--;
    }

    // Advance past events that have fully ended
    while (
      this._eventIndex < evs.length - 1 &&
      elapsed >= evs[this._eventIndex].time + evs[this._eventIndex].duration
    ) {
      this._eventIndex++;
    }

    const ev = evs[this._eventIndex];
    if (elapsed >= ev.time && elapsed < ev.time + ev.duration) return ev;
    return null;
  }

  // Returns the next event that hasn't started yet — used for gap detection.
  // Still O(n) worst-case but called only in the gap branch, which is rare.
  // Could be replaced with _eventIndex + 1 lookup for strict O(1) if needed.
  _getNextEvent(elapsed) {
    for (let i = 0; i < this._events.length; i++) {
      if (this._events[i].time > elapsed) return this._events[i];
    }
    return null;
  }

  _buildTargets(visemeName) {
    const morphWeights = VISEME_MAP[visemeName] ?? {};
    const targets = { ...this._rest };

    Object.entries(morphWeights).forEach(([name, weight]) => {
      if (this._available.has(name)) {
        targets[name] = Math.min(1, weight * this.globalScale);
      }
    });

    return targets;
  }

  _applyMorphs(delta) {
    const dict = this.dictionary;

    Object.entries(this._currentTargets).forEach(([name, target]) => {
      const idx = dict[name];
      if (idx === undefined) return;

      const current = this.influences[idx];
      const isResting = target < 0.01;
      const speed = isResting ? this.restBlendSpeed : this.blendSpeed;

      const dt = Math.min(delta, 0.033);
      let nextValue = current + (target - current) * (1 - Math.exp(-speed * dt));

      if (Math.abs(target - nextValue) < 0.001) {
        nextValue = target;
      }

      this.influences[idx] = Math.max(0, Math.min(1, nextValue));
    });
  }

  _applyIdleBreath(delta) {
    this._breathPhase += delta * 0.75;
    const breath = Math.max(0, Math.sin(this._breathPhase) * 0.012);

    const applyBreath = (name, scale) => {
      const idx = this.dictionary[name];
      if (idx !== undefined) this.influences[idx] = breath * scale;
    };

    applyBreath('Mouth_Drop_Lower', 0.5);
    applyBreath('Mouth_Drop_Upper', 0.3);
    applyBreath('Mouth_Down_Lower_L', 0.2);
    applyBreath('Mouth_Down_Lower_R', 0.2);
    applyBreath('Mouth_Shrug_Lower', 0.25);
    applyBreath('Jaw_Open', 0.15);
  }
}

// ---------------------------------------------------------------------------
// AUDIO-DRIVEN LIPSYNC (Upgraded: FFT Frequency-Band Analysis)
// ---------------------------------------------------------------------------

export class AudioLipSync {
  /**
   * @param {{ mesh, influences, dictionary }} morphTargets
   * @param {object} [options]
   * @param {number} [options.smoothing=0.6]     Lower smoothing for punchier frequency response
   * @param {number} [options.gain=2.5]          Overall multiplier for the movement
   * @param {number} [options.blendSpeed=20]
   * @param {number} [options.restBlendSpeed=15]
   */
  constructor(morphTargets, options = {}) {
    this._morph = morphTargets;
    this._available = new Set(Object.keys(morphTargets.dictionary));
    this.smoothing = options.smoothing ?? 0.6;
    this.gain = options.gain ?? 2.5;
    this.blendSpeed = options.blendSpeed ?? 20;
    this.restBlendSpeed = options.restBlendSpeed ?? 15;

    this._ctx = null;
    this._analyser = null;
    this._dataArray = null;
    this._source = null;
    this._running = false;
  }

  async fromAudioElement(audioEl) {
    await this._initCtx();
    this._source = this._ctx.createMediaElementSource(audioEl);
    this._source.connect(this._analyser);
    this._analyser.connect(this._ctx.destination);
  }

  async fromMicrophone() {
    await this._initCtx();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this._source = this._ctx.createMediaStreamSource(stream);
    this._source.connect(this._analyser);
  }

  /**
   * FIX Guard against re-initialisation leaking AudioNodes.
   *
   * Old behaviour: calling _initCtx() a second time (e.g. fromAudioElement()
   * called twice) created a new AnalyserNode and overwrote this._analyser
   * without disconnecting the previous source or analyser. The old nodes
   * stayed connected to the audio graph and kept the AudioContext alive,
   * leaking CPU and memory.
   *
   * Fix: disconnect and null out both the source and the analyser before
   * creating new ones. The AudioContext itself is reused across calls.
   */
  async _initCtx() {
    // Tear down existing nodes before creating new ones
    if (this._source) {
      try { this._source.disconnect(); } catch (_) { /* already disconnected */ }
      this._source = null;
    }
    if (this._analyser) {
      try { this._analyser.disconnect(); } catch (_) { /* already disconnected */ }
      this._analyser = null;
    }

    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this._ctx.state === 'suspended') await this._ctx.resume();

    this._analyser = this._ctx.createAnalyser();
    this._analyser.fftSize = 256;
    this._analyser.smoothingTimeConstant = this.smoothing;
    this._dataArray = new Uint8Array(this._analyser.frequencyBinCount);
  }

  start() { this._running = true; }
  stop() { this._running = false; }

  update(delta) {
    if (!this._analyser || !this._running) {
      this._applyAudioShapes(delta, 0, 0, 0, 0);
      return;
    }

    this._analyser.getByteFrequencyData(this._dataArray);

    const bins = this._analyser.frequencyBinCount; // 128 bins
    // At fftSize=256, sampleRate~44100: each bin ≈ 172Hz
    // Bass:  bins  1–12  (~172Hz–2kHz)   → vowel body, jaw open
    // Mid:   bins 13–35  (~2kHz–6kHz)    → "E", "ih", formants
    // High:  bins 36–80  (~6kHz–13.7kHz) → fricatives, sibilants

    let bassSum = 0, midSum = 0, highSum = 0, totalSum = 0;

    for (let i = 1; i < bins; i++) {
      const val = this._dataArray[i] / 255.0;
      totalSum += val;
      if (i <= 12) bassSum += val;
      else if (i <= 35) midSum += val;
      else if (i <= 80) highSum += val;
    }

    const vol = (totalSum / (bins - 1)) * this.gain;
    const bass = (bassSum / 12) * this.gain;
    const mid = (midSum / 23) * this.gain;
    const high = (highSum / 45) * this.gain;

    this._applyAudioShapes(delta, vol, bass, mid, high);
  }

  _applyAudioShapes(delta, vol, bass, mid, high) {
    const dict = this._morph.dictionary;
    const inf = this._morph.influences;

    // Only morphs confirmed present on the reduced mesh
    const targets = {
      Jaw_Open: 0,
      Mouth_Shrug_Upper: 0, Mouth_Shrug_Lower: 0,
      Mouth_Down_Lower_L: 0, Mouth_Down_Lower_R: 0,
      Mouth_Up_Upper_L: 0, Mouth_Up_Upper_R: 0,
      Mouth_Funnel_Up_L: 0, Mouth_Funnel_Up_R: 0,
      Mouth_Funnel_Down_L: 0, Mouth_Funnel_Down_R: 0,
      Mouth_Pucker_Up_L: 0, Mouth_Pucker_Up_R: 0,
      Mouth_Pucker_Down_L: 0, Mouth_Pucker_Down_R: 0,
      Mouth_Smile_L: 0, Mouth_Smile_R: 0,
      Mouth_Stretch_L: 0, Mouth_Stretch_R: 0,
      Mouth_Close: 0,
    };

    if (vol > 0.05) {
      const clamp = (v, max) => Math.min(max, Math.max(0, v));
      const loudness = clamp(vol * 0.6, 1);

      const total = bass + mid + high + 0.001;
      const bassRatio = bass / total;
      const midRatio = mid / total;
      const highRatio = high / total;

      // --- BASE OPEN: symmetric so mouth stays anchored ---
      targets.Jaw_Open = clamp(loudness * 0.45, 0.45);
      targets.Mouth_Shrug_Upper = clamp(loudness * 0.3, 0.3);
      targets.Mouth_Shrug_Lower = clamp(loudness * 0.25, 0.25);
      targets.Mouth_Up_Upper_L = clamp(loudness * 0.15, 0.15);
      targets.Mouth_Up_Upper_R = clamp(loudness * 0.15, 0.15);
      targets.Mouth_Funnel_Up_L = clamp(loudness * 0.2, 0.2);
      targets.Mouth_Funnel_Up_R = clamp(loudness * 0.2, 0.2);
      targets.Mouth_Funnel_Down_L = clamp(loudness * 0.18, 0.18);
      targets.Mouth_Funnel_Down_R = clamp(loudness * 0.18, 0.18);

      // --- BASS bonus → open vowel (aa/oh) ---
      const bassBonus = clamp(bass * bassRatio * 1.5, 0.4);
      targets.Jaw_Open = clamp(targets.Jaw_Open + bassBonus * 0.3, 0.75);
      targets.Mouth_Down_Lower_L = clamp(bassBonus * 0.3, 0.3);
      targets.Mouth_Down_Lower_R = clamp(bassBonus * 0.3, 0.3);
      targets.Mouth_Shrug_Upper = clamp(targets.Mouth_Shrug_Upper + bassBonus * 0.15, 0.4);
      targets.Mouth_Up_Upper_L = clamp(targets.Mouth_Up_Upper_L + bassBonus * 0.1, 0.2);
      targets.Mouth_Up_Upper_R = clamp(targets.Mouth_Up_Upper_R + bassBonus * 0.1, 0.2);
      targets.Mouth_Close = clamp(targets.Mouth_Close - bassBonus * 0.3, 0.3);

      // --- MID bonus → smile/wide (E/ih) ---
      const midBonus = clamp(mid * midRatio * 1.5, 0.35);
      targets.Mouth_Smile_L = clamp(midBonus * 0.4, 0.35);
      targets.Mouth_Smile_R = clamp(midBonus * 0.4, 0.35);
      targets.Mouth_Stretch_L = clamp(midBonus * 0.2, 0.2);
      targets.Mouth_Stretch_R = clamp(midBonus * 0.2, 0.2);

      // --- HIGH bonus → fricative/constricted (FF/SS/CH) ---
      const highBonus = clamp(high * highRatio * 1.5, 0.35);
      targets.Mouth_Pucker_Up_L = clamp(highBonus * 0.4, 0.4);
      targets.Mouth_Pucker_Up_R = clamp(highBonus * 0.4, 0.4);
      targets.Mouth_Pucker_Down_L = clamp(highBonus * 0.35, 0.35);
      targets.Mouth_Pucker_Down_R = clamp(highBonus * 0.35, 0.35);
      targets.Mouth_Shrug_Upper = clamp(targets.Mouth_Shrug_Upper + highBonus * 0.2, 0.4);
      const fricativeClose = highBonus * highRatio;
      targets.Jaw_Open = clamp(targets.Jaw_Open - fricativeClose * 0.2, 0.75);
      targets.Mouth_Close = clamp(fricativeClose * 0.25, 0.3);
    }

    const speed = vol < 0.05 ? this.restBlendSpeed : this.blendSpeed;

    Object.entries(targets).forEach(([name, target]) => {
      const idx = dict[name];
      if (idx === undefined) return;
      const cur = inf[idx];
      let next = cur + (target - cur) * (1 - Math.exp(-speed * delta));
      if (Math.abs(target - next) < 0.001) next = target;
      inf[idx] = Math.max(0, Math.min(1, next));
    });
  }
}