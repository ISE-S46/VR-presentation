import { useEffect } from 'react';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import type {
  ActionsMap,
  MorphTargets,
  AnimationController,
} from '../types/characters.type';

interface Props {
  actions: ActionsMap;
  controller: AnimationController;
  morphTargets: MorphTargets | null;
}

export default function CharacterControls({
  actions,
  controller,
  morphTargets,
}: Props) {
  useEffect(() => {
    const gui = new GUI({ title: 'Controls' });

    // --- Base Actions ---
    const baseFolder = gui.addFolder('Base Actions');
    const buttonActions: Record<string, () => void> = {};

    Object.keys(actions).forEach((name) => {
      buttonActions[name] = () => controller.switchAction(name);
      baseFolder.add(buttonActions, name).name(name);
    });

    buttonActions['Stop All'] = () => controller.stopAll();
    baseFolder.add(buttonActions, 'Stop All');
    baseFolder.open();

    // --- General Speed ---
    const speedSettings = { timeScale: 1.0 };
    const speedFolder = gui.addFolder('General Speed');
    speedFolder
      .add(speedSettings, 'timeScale', 0.0, 2.0, 0.01)
      .name('time scale')
      .onChange((value: number) => controller.setTimeScale(value));
    speedFolder.open();

    // --- Face Controls ---
    if (morphTargets) {
      const faceFolder = gui.addFolder('Face Controls');
      const { influences, dictionary } = morphTargets;

      Object.entries(dictionary).forEach(([name, index]) => {
        // .listen() keeps the slider live — lipsync writes to influences
        // every rAF frame so the GUI reflects the current driven value.
        faceFolder.add(influences, index, 0, 1, 0.01).name(name).listen();
      });

      faceFolder.open();
    }

    return () => {
      gui.destroy();
    };
  // Actions and morphTargets only change once (after init), so this
  // effect runs once when the panel mounts and cleans up on unmount.
  }, [actions, controller, morphTargets]);

  // lil-gui mounts itself directly into document.body — no DOM node needed
  return null;
}