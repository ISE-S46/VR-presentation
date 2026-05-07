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
export function createCamera(canvas?: HTMLCanvasElement): PerspectiveCamera {
  // Use container's aspect ratio if canvas is provided, otherwise use window
  let aspect = window.innerWidth / window.innerHeight;
  if (canvas?.parentElement) {
    const parent = canvas.parentElement;
    aspect = parent.clientWidth / parent.clientHeight;
  }

  const camera = new PerspectiveCamera(
    45, // Lower FOV for less distortion
    aspect,
    0.1,
    10000
  );

  // Zoomed back slightly to show more of the upper body and head comfortably
  camera.position.set(0, 1.4, 2.5);
  return camera;
}

export function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
  const isMobile = window.innerWidth <= 768;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: !isMobile, // Disable on mobile to save GPU
    alpha: true,
  });

  const parent = canvas.parentElement;
  if (parent) {
    renderer.setSize(parent.clientWidth, parent.clientHeight);
  } else {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  // Cap pixel ratio heavily on mobile to prevent lag
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));

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