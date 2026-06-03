import { useEffect, useRef } from 'react';
import '../styles/components/InteractiveMeshBackground.css';

export default function InteractiveMeshBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Track mouse coordinates for the ambient drift
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Store active liquid particles/droplets
  const particlesRef = useRef([]);

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

  // Handle canvas sizing
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle click bursts
  useEffect(() => {
    const handleClick = (e) => {
      // Spawn 12 to 18 organic droplets of varying pastel hues
      const count = 12 + Math.floor(Math.random() * 7);
      const colors = [
        'rgba(20, 184, 166, ',   // Teal
        'rgba(167, 139, 250, ',  // Violet
        'rgba(56, 189, 248, ',   // Sky
        'rgba(255, 255, 255, '   // White/Light
      ];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 9; // Range of ejection velocities
        const baseColor = colors[Math.floor(Math.random() * colors.length)];

        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          // Large radius so they form soft, visible metaball droplets under the 130px blur
          radius: 35 + Math.random() * 45,
          baseColor,
          alpha: 0.95,
          decay: 0.006 + Math.random() * 0.008, // Slow organic fade
          friction: 0.95 + Math.random() * 0.02, // Friction slows droplets down
          gravity: -0.03 - Math.random() * 0.05 // Upward lift to simulate a floating fluid medium
        });
      }
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  // Main animation render loop
  useEffect(() => {
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.003; // Drift phase
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      const blobs = blobsRef.current;
      const container = containerRef.current;
      if (!container) return;

      const children = container.querySelectorAll('.mesh-blob');

      // 1. Update and apply eased coordinates for each primary blob
      blobs.forEach((blob, i) => {
        // Ambient movement offsets using sine/cosine waves
        const ambientX = Math.sin(time + i * 2.0) * 120;
        const ambientY = Math.cos(time * 0.7 + i * 1.5) * 120;

        // Target is mouse position + base offset + ambient drift
        const targetX = mouseX + blob.baseOffset.x + ambientX;
        const targetY = mouseY + blob.baseOffset.y + ambientY;

        // Easing interpolation
        blob.currentX += (targetX - blob.currentX) * blob.ease;
        blob.currentY += (targetY - blob.currentY) * blob.ease;

        const xPct = (blob.currentX / width) * 100;
        const yPct = (blob.currentY / height) * 100;

        const child = children[i];
        if (child) {
          child.style.left = `${xPct}%`;
          child.style.top = `${yPct}%`;
        }
      });

      // 2. Clear canvas and redraw/update metaball particles
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const particles = particlesRef.current;
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            // Apply physics: movement, drag, gravity/floating force
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.alpha -= p.decay;
            p.radius -= 0.15; // Slowly shrink as they dissolve

            // Delete dead particles
            if (p.alpha <= 0 || p.radius <= 1) {
              particles.splice(i, 1);
              continue;
            }

            // Render droplet (will blur beautifully with CSS filters)
            ctx.beginPath();
            ctx.fillStyle = `${p.baseColor}${p.alpha})`;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div ref={containerRef} className="mesh-background-container" aria-hidden="true">
      <canvas ref={canvasRef} className="mesh-canvas" />
      <div className="mesh-blob blob-teal" />
      <div className="mesh-blob blob-violet" />
      <div className="mesh-blob blob-sky" />
      <div className="mesh-grid-overlay" />
    </div>
  );
}

