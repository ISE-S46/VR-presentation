import { useEffect, useRef } from 'react';
import '../styles/components/InteractiveMeshBackground.css';

export default function InteractiveMeshBackground() {
  const containerRef = useRef(null);

  // Track mouse coordinates
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Eased coordinates for blobs
  const blobsRef = useRef([
    {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      currentX: window.innerWidth / 2,
      currentY: window.innerHeight / 2,
      ease: 0.05,
      baseOffset: { x: -80, y: -80 }
    },
    {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      currentX: window.innerWidth / 2,
      currentY: window.innerHeight / 2,
      ease: 0.025,
      baseOffset: { x: 120, y: 80 }
    },
    {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      currentX: window.innerWidth / 2,
      currentY: window.innerHeight / 2,
      ease: 0.018,
      baseOffset: { x: -40, y: 160 }
    }
  ]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.003; // Time factor for organic drift
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      const blobs = blobsRef.current;
      const container = containerRef.current;
      if (!container) return;

      const children = container.querySelectorAll('.mesh-blob');

      // Update and apply eased coordinates for each blob
      blobs.forEach((blob, i) => {
        // Ambient movement offsets using sine/cosine waves
        const ambientX = Math.sin(time + i * 2.0) * 120;
        const ambientY = Math.cos(time * 0.7 + i * 1.5) * 120;

        // Target is mouse position + base offset + ambient drift
        const targetX = mouseX + blob.baseOffset.x + ambientX;
        const targetY = mouseY + blob.baseOffset.y + ambientY;

        // Easing interpolation: current += (target - current) * ease
        blob.currentX += (targetX - blob.currentX) * blob.ease;
        blob.currentY += (targetY - blob.currentY) * blob.ease;

        // Convert coordinates to percentage positions for responsive container
        const xPct = (blob.currentX / width) * 100;
        const yPct = (blob.currentY / height) * 100;

        const child = children[i];
        if (child) {
          child.style.left = `${xPct}%`;
          child.style.top = `${yPct}%`;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div ref={containerRef} className="mesh-background-container" aria-hidden="true">
      <div className="mesh-blob blob-teal" />
      <div className="mesh-blob blob-violet" />
      <div className="mesh-blob blob-sky" />
      <div className="mesh-grid-overlay" />
    </div>
  );
}
