import { useEffect, useRef } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Timer
} from 'three';
import { createScene, createCamera, createRenderer, onResize } from '../core/renderer';
import { createControls } from '../core/controls';
import { setupLights, disposeLights, type LightSetup } from '../world/light';

export interface SceneRefs {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: ReturnType<typeof createControls>;
}

/**
 * Owns the Three.js scene, camera, renderer, orbit controls, and lighting.
 * Starts the rAF loop and calls onFrame(delta) each tick.
 * Calls onSceneReady(scene) once after setup so callers can trigger
 * dependent effects (e.g. GLB loading) only after the scene exists.
 * Handles window resize automatically.
 *
 * Returns controlsRef so callers can toggle orbit controls at any time:
 *   controlsRef.current.enabled = false; // disable
 *   controlsRef.current.enabled = true;  // enable
 */
export function useScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onSceneReady: (scene: Scene) => void,
  onFrame: (delta: number) => void,
) {
  const sceneRefsRef = useRef<SceneRefs | null>(null);
  const controlsRef = useRef<ReturnType<typeof createControls> | null>(null);
  const lightSetupRef = useRef<LightSetup | null>(null);
  const rafRef = useRef<number>(0);

  // Keep callbacks stable in the rAF closure without re-subscribing
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  const onSceneReadyRef = useRef(onSceneReady);
  onSceneReadyRef.current = onSceneReady;

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = createScene();
    const camera = createCamera();
    const renderer = createRenderer(canvasRef.current);
    const controls = createControls(camera, renderer);

    lightSetupRef.current = setupLights(scene, renderer);
    sceneRefsRef.current = { scene, camera, renderer, controls };
    controlsRef.current = controls;

    // Fix initial aspect ratio by applying parent dimensions immediately
    onResize(camera, renderer);

    // Notify coordinator that scene is ready — triggers GLB load
    onSceneReadyRef.current(scene);

    const timer = new Timer();
    timer.connect(document);

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      timer.update();
      const delta = Math.min(timer.getDelta(), 1 / 30);
      onFrameRef.current(delta);
      // Skip damping math entirely when controls are disabled
      if (controls.enabled) controls.update();
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => onResize(camera, renderer);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);

      if (lightSetupRef.current) {
        disposeLights(scene, lightSetupRef.current);
        lightSetupRef.current = null;
      }

      controls.dispose();
      renderer.dispose();
      sceneRefsRef.current = null;
      controlsRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // canvasRef.current is intentionally excluded — it's a ref, never changes identity

  return { sceneRefsRef, controlsRef };
}