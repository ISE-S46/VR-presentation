import {
  Scene,
  WebGLRenderer,
  PMREMGenerator,
  Texture
} from 'three';

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface LightSetup {
  pmrem: PMREMGenerator;
  envMap: Texture | null;
}

// setup environment lighting (NO globals)
export function setupLights(
  scene: Scene,
  renderer: WebGLRenderer
): LightSetup {
  const pmrem = new PMREMGenerator(renderer);

  const environment = new RoomEnvironment();
  const envMap = pmrem.fromScene(environment, 0.04).texture;

  scene.environment = envMap;

  return {
    pmrem,
    envMap,
  };
}

// cleanup (VERY important for memory)
export function disposeLights(
  scene: Scene,
  setup: LightSetup
): void {
  if (scene.environment) {
    scene.environment.dispose();
    scene.environment = null;
  }

  setup.pmrem.dispose();
}