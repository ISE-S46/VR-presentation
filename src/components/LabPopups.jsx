import { useEffect, useState } from 'react';
import { useAvatarStatus } from '../hooks/useAvatarStatus';
import aiImg from '../assets/AI.JPG';
import immersiveImg from '../assets/Immersive.JPG';
import iotImg from '../assets/IOT.JPG';
import '../styles/components/LabPopups.css';

/**
 * Lab image popups for the Home page.
 *
 * When the avatar narrates the "...home to four labs: A.I., Immersive Media,
 * I.O.T., and Innovation..." line, each lab's photo pops in exactly as its name
 * is spoken and then STAYS, so the photos accumulate side-by-side. Once the last
 * lab ("Innovation") has been named, they all fade out together.
 *
 * Timing reuses the same weighted-timestamp approach as the partner highlighting
 * in OurPartners, so the popups stay in sync with the text-to-speech pacing
 * (which adds pauses at punctuation).
 */
const LAB_TARGETS = [
  { keyword: 'a.i.', img: aiImg, label: 'A.I. Lab' },
  { keyword: 'immersive', img: immersiveImg, label: 'Immersive Media Lab' },
  { keyword: 'i.o.t.', img: iotImg, label: 'I.O.T. Lab' },
];

const DISMISS_KEYWORD = 'innovation'; // the last lab named in the script
const HOLD_AFTER_LAST_MS = 1400; // keep all photos up after the last lab is named
const EXIT_MS = 480; // group fade-out duration (matches the CSS transition)

export default function LabPopups() {
  const { status, spokenText, durationMs } = useAvatarStatus();
  const [labs, setLabs] = useState([]); // accumulated, currently-visible labs
  const [leaving, setLeaving] = useState(false);

  // Warm the browser cache so the first popup appears instantly, not blank.
  useEffect(() => {
    LAB_TARGETS.forEach(({ img }) => {
      const preload = new Image();
      preload.src = img;
    });
  }, []);

  useEffect(() => {
    const isLabLine =
      status === 'speaking' && spokenText && spokenText.toLowerCase().includes('four labs');

    if (!isLabLine) {
      // Deferred clear so it isn't a synchronous setState inside the effect.
      const id = requestAnimationFrame(() => {
        setLabs([]);
        setLeaving(false);
      });
      return () => cancelAnimationFrame(id);
    }

    const lower = spokenText.toLowerCase();
    const L = spokenText.length;
    const estimatedMs = Math.max(4500, (L / 12.8) * 1000);
    const activeDurationMs = durationMs || estimatedMs;

    // Convert a character index into a timestamp, weighting punctuation pauses
    // the same way the TTS engine does (calibrated for 0.97 playback speed).
    const weightedTime = (targetIdx) => {
      const ellipsisWeight = 12.3;
      const commaWeight = 3.7;
      const periodWeight = 7.7;
      let virtualLength = 0;
      let targetVirtual = 0;

      for (let i = 0; i < L; i++) {
        let weight = 1;
        if (spokenText.substr(i, 3) === '...') {
          weight = ellipsisWeight;
          if (i < targetIdx) targetVirtual += weight;
          virtualLength += weight;
          i += 2;
          continue;
        } else if (spokenText[i] === ',' || spokenText[i] === ';') {
          weight = commaWeight;
        } else if (spokenText[i] === '.' || spokenText[i] === '!' || spokenText[i] === '?') {
          weight = periodWeight;
        }
        if (i < targetIdx) targetVirtual += weight;
        virtualLength += weight;
      }

      return (targetVirtual / virtualLength) * activeDurationMs;
    };

    const timers = [];

    // Each lab pops in (and stays) the moment its name is spoken.
    const presentIdxs = [];
    LAB_TARGETS.forEach((target) => {
      const idx = lower.indexOf(target.keyword);
      if (idx === -1) return;
      presentIdxs.push(idx);
      const appearAt = weightedTime(idx);
      timers.push(
        setTimeout(() => {
          setLabs((prev) =>
            prev.some((l) => l.label === target.label) ? prev : [...prev, target]
          );
        }, appearAt)
      );
    });

    // Once the last lab ("Innovation") is named, fade all photos out together.
    const dismissIdx = lower.indexOf(DISMISS_KEYWORD);
    const anchorIdx = dismissIdx !== -1 ? dismissIdx : Math.max(...presentIdxs, 0);
    const dismissAt = weightedTime(anchorIdx) + HOLD_AFTER_LAST_MS;

    timers.push(setTimeout(() => setLeaving(true), dismissAt));
    timers.push(
      setTimeout(() => {
        setLabs([]);
        setLeaving(false);
      }, dismissAt + EXIT_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, [status, spokenText, durationMs]);

  if (labs.length === 0) return null;

  return (
    <div className={`lab-popup-row ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      {labs.map((lab) => (
        <div className="lab-popup-card" key={lab.label}>
          <div className="lab-popup-image-wrap">
            <img src={lab.img} alt={lab.label} className="lab-popup-image" />
          </div>
          <span className="lab-popup-label">{lab.label}</span>
        </div>
      ))}
    </div>
  );
}
