import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PerspectiveCamera, WebGLRenderer } from 'three';

// instance-based controls
export function createControls(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  // Point the camera right at the face
  controls.target.set(0, 1.4, 0); 
  controls.update();

  return controls;
}