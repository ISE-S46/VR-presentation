import {
  AnimationMixer,
  Object3D,
  Mesh,
} from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { fixMaterial } from './materials';
import type { ActionsMap, MorphTargets, LoadCharacterResult } from '../types/characters.type';

// Module-level singleton — reused across calls instead of re-instantiated each time
const _loader = new GLTFLoader();

export function loadCharacter(
  path: string,
  scene: Object3D
): Promise<LoadCharacterResult> {
  return new Promise((resolve, reject) => {
    _loader.load(
      path,
      (gltf: GLTF) => {
        const object = gltf.scene;

        // Remove morph animation tracks (lip sync handled separately)
        gltf.animations.forEach((clip) => {
          clip.tracks = clip.tracks.filter(
            (track) => !track.name.includes('morphTargetInfluences')
          );
        });

        // Single traverse — find morph mesh AND fix materials in one pass
        let faceMesh: Mesh | null = null;
        let morphTargets: MorphTargets | null = null;

        object.traverse((child) => {
          if (!(child instanceof Mesh)) return;

          // Morph targets — capture the first mesh that has them
          if (child.morphTargetInfluences && !faceMesh) {
            faceMesh = child;
            morphTargets = {
              mesh: child,
              influences: child.morphTargetInfluences,
              dictionary: child.morphTargetDictionary ?? {},
            };

            console.log('✅ Found morph target mesh:', child.name);
            console.log(
              'Total morphs:',
              Object.keys(morphTargets.dictionary).length
            );
          }

          // Materials
          fixMaterial(child);
        });

        // Animation setup
        const mixer = new AnimationMixer(object);
        const actions: ActionsMap = {};
        const clips = gltf.animations;

        if (clips.length > 0) {
          console.log(`Total animations found: ${clips.length}`);

          clips.forEach((clip, i) => {
            const actionName = clip.name;

            console.log(
              `[${i}] Initializing Action: "${actionName}" — ${clip.duration.toFixed(3)}s`
            );

            const action = mixer.clipAction(clip);
            action.setEffectiveWeight(1);
            action.enabled = true;
            actions[actionName] = action;
          });

          console.log('All actions ready:', Object.keys(actions));
        } else {
          console.warn('No animations found in the provided clips.');
        }

        // Add to scene (passed in, not global)
        scene.add(object);

        resolve({
          object,
          mixer,
          actions,
          morphTargets,
        });
      },
      (xhr) => {
        if (xhr.total) {
          console.log(
            ((xhr.loaded / xhr.total) * 100).toFixed(2) + '% loaded'
          );
        }
      },
      (error) => {
        console.error('GLB load error:', error);
        reject(error);
      }
    );
  });
}

function disposeNode(node: Object3D): void {
  const mesh = node as Mesh;

  mesh.geometry?.dispose();

  if (mesh.material) {
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    materials.forEach((mat) => {
      Object.values(mat).forEach((val: unknown) => {
        if (
          typeof val === 'object' &&
          val !== null &&
          'isTexture' in val &&
          (val as { isTexture?: boolean }).isTexture
        ) {
          const disposable = val as { dispose?: unknown };
          if (typeof disposable.dispose === 'function') {
            disposable.dispose();
          }
        }
      });

      mat.dispose();
    });
  }
}

export function disposeCharacter(
  object: Object3D,
  mixer?: AnimationMixer
): void {
  if (mixer) {
    mixer.stopAllAction();
    mixer.uncacheRoot(object);
  }

  object.traverse(disposeNode);

  if (object.parent) {
    object.parent.remove(object);
  }
}