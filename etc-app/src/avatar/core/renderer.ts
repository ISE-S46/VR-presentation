import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SRGBColorSpace,
  ACESFilmicToneMapping
} from 'three';

// create scene (no globals)
export function createScene(): Scene {
  return new Scene();
}

// create camera
export function createCamera(): PerspectiveCamera {
  const camera = new PerspectiveCamera(
    45, // Lower FOV for less distortion
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  // Zoomed back slightly to show more of the upper body and head comfortably
  camera.position.set(0, 1.4, 2.0);
  return camera;
}

// create renderer from canvas
export function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  const parent = canvas.parentElement;
  if (parent) {
    renderer.setSize(parent.clientWidth, parent.clientHeight);
  } else {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  return renderer;
}

// resize handler (no global renderer)
export function onResize(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
): void {
  const canvas = renderer.domElement;
  const parent = canvas.parentElement;
  if (!parent) return;

  camera.aspect = parent.clientWidth / parent.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(parent.clientWidth, parent.clientHeight);
}