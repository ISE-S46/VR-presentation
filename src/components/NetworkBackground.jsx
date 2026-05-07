import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function NetworkBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  const isMobile = window.innerWidth <= 768;

  return (
    <Particles
      id="tsparticles"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none"
      }}
      options={{
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: isMobile ? 30 : 60, // Cap FPS on mobile
        interactivity: {
          events: {
            onHover: {
              enable: !isMobile, // Disable hover effect on mobile
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          color: { value: "#0d9488" },
          links: {
            color: "#7c3aed",
            distance: isMobile ? 100 : 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: isMobile ? 0.4 : 0.8, // Slow down slightly on mobile
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: isMobile ? 25 : 60, // Drastically cut particles on mobile
          },
          opacity: { value: 0.4 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: !isMobile, // Retina calculation hurts mobile GPU a lot
      }}
    />
  );
}
