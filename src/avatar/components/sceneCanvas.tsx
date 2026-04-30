import type { RefObject } from 'react';

interface SceneCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export default function SceneCanvas({ canvasRef }: SceneCanvasProps) {
  return <canvas ref={canvasRef} className="threejs" />;
}
