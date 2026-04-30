import type { AnimationControllerParams, AnimationController } from "../types/characters.type";

export function createAnimationController({
  actions,
  mixer,
  lipSync,
  audioLipSync,
}: AnimationControllerParams): AnimationController {
  let currentAction: string | null = null;
  let disposed = false;

  function play(name: string, fromName: string | null = currentAction) {
    if (disposed) return;

    if (fromName && actions[fromName]) {
      actions[fromName].fadeOut(0.35);
    }

    if (name && actions[name]) {
      actions[name].reset().fadeIn(0.35).play();
    }

    currentAction = name;
  }

  function switchAction(name: string) {
    if (disposed || name === currentAction) return;
    play(name);
  }

  function stopAll() {
    if (disposed) return;
    if (mixer) mixer.stopAllAction();
    if (lipSync) lipSync.stop();
    if (audioLipSync) audioLipSync.stop();
    currentAction = null;
  }

  function setTimeScale(value: number) {
    if (disposed) return;
    if (mixer) mixer.timeScale = value;
  }

  function getCurrentAction(): string | null {
    return currentAction;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    stopAll();
    currentAction = null;
  }

  // Play default action on init
  const actionNames = Object.keys(actions);
  if (actionNames.length > 0) {
    const defaultAction = actionNames.includes('Idle') ? 'Idle' : actionNames[0];
    play(defaultAction, null);
  }

  return {
    switchAction,
    stopAll,
    setTimeScale,
    getCurrentAction,
    dispose,
  };
}