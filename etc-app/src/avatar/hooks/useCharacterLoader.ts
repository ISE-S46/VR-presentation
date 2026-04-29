import { useEffect, useRef, useState } from 'react';
import { Scene } from 'three';
import { loadCharacter, disposeCharacter } from '../characters/loader';
import { createAnimationController } from '../characters/animationController';
import { LipSync, AudioLipSync } from '../../library/lipsyncEN.js';
import type {
  ActionsMap,
  AnimationController,
  LoadCharacterResult,
  MorphTargets,
  CharacterRefs,
  CharacterLoaderResult
} from '../types/characters.type';

/**
 * Loads the GLB, sets up LipSync + AudioLipSync, creates the animation
 * controller, and exposes React state for UI plus refs for the rAF loop.
 */
export function useCharacterLoader(
  scene: Scene | null,
  modelUrl: string = '/model/Model1.glb'
): CharacterLoaderResult {
  const [ready, setReady] = useState(false);
  const [actions, setActions] = useState<ActionsMap>({});
  const [morphTargets, setMorphTargets] = useState<MorphTargets | null>(null);
  const [controller, setController] = useState<AnimationController | null>(null);

  const characterRef = useRef<LoadCharacterResult | null>(null);
  const controllerRef = useRef<AnimationController | null>(null);
  const refsRef = useRef<CharacterRefs | null>(null);

  useEffect(() => {
    if (!scene || !modelUrl) return;

    let mounted = true;

    async function init() {
      const character = await loadCharacter(modelUrl, scene!);
      if (!mounted) return;

      if (!character.morphTargets) {
        console.error('❌ No morph targets found');
        return;
      }

      characterRef.current = character;

      const lipSync = new LipSync(character.morphTargets, {
        blendSpeed: 15.5,
        restBlendSpeed: 14,
        idleBreath: true,
      });

      const audioLipSync = new AudioLipSync(character.morphTargets, {
        gain: 3.5,
      });

      refsRef.current = {
        mixer: character.mixer,
        lipSync,
        audioLipSync,
      };

      const ctrl = createAnimationController({
        actions: character.actions,
        mixer: character.mixer,
        lipSync,
        audioLipSync,
      });

      controllerRef.current = ctrl;
      setController(ctrl);
      setActions(character.actions);
      setMorphTargets(character.morphTargets);
      setReady(true);
    }

    init();

    return () => {
      mounted = false;

      controllerRef.current?.dispose();
      controllerRef.current = null;

      if (characterRef.current) {
        disposeCharacter(characterRef.current.object, refsRef.current?.mixer);
        characterRef.current = null;
      }

      refsRef.current = null;
    };
  }, [scene]);

  return {
    ready,
    actions,
    morphTargets,
    controller,
    refs: refsRef,
    controllerRef,
  };
}