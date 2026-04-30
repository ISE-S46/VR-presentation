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
        let bestMorphMesh: Mesh | null = null;
        let bestMorphCount = 0;
        let preferredFound = false;

        object.traverse((child) => {
          if (!(child instanceof Mesh)) return;

          fixMaterial(child);

          if (preferredFound || !child.morphTargetInfluences) return;

          const childName = child.name.toLowerCase();

          // Skip accessory meshes that share facial morph targets
          if (
            childName.includes('eye') ||
            childName.includes('tear') ||
            childName.includes('occlusion')
          ) return;

          const morphCount = Object.keys(child.morphTargetDictionary ?? {}).length;

          if (childName.includes('body') || childName.includes('head')) {
            bestMorphMesh = child;
            preferredFound = true; // stops all further morph checks
            return;
          }

          if (morphCount > bestMorphCount) {
            bestMorphMesh = child;
            bestMorphCount = morphCount;
          }
        });

        let morphTargets: MorphTargets | null = null;
        if (bestMorphMesh) {
          const mesh = bestMorphMesh as Mesh;
          morphTargets = {
            mesh,
            influences: mesh.morphTargetInfluences!,
            dictionary: mesh.morphTargetDictionary ?? {},
          };
          // console.log('✅ Found morph target mesh:', mesh.name);
          // console.log('Total morphs:', Object.keys(morphTargets.dictionary).length);
        }

        // Animation setup
        const mixer = new AnimationMixer(object);
        const actions: ActionsMap = {};
        const clips = gltf.animations;

        if (clips.length > 0) {
          console.log(`Total animations found: ${clips.length}`);

          clips.forEach((clip) => {
            const actionName = clip.name;

            // console.log(
            //   `[${i}] Initializing Action: "${actionName}" — ${clip.duration.toFixed(3)}s`
            // );

            const action = mixer.clipAction(clip);
            action.setEffectiveWeight(1);
            action.enabled = true;
            actions[actionName] = action;
          });

          // console.log('All actions ready:', Object.keys(actions));
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