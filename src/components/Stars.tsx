import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

interface StarsProps {
  id?: string;
}

const StarsBackground = ({ id = "tsparticles" }: StarsProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    // Only init if not already done
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true); // Fix: Set to true, not 'init'
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 24,
      particles: {
        number: {
          value: 400,
          density: {
            enable: true,
            area: 800,
          },
        },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.05, max: 0.4 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 2 },
        },
        move: {
          enable: true,
          speed: 0.25,
          direction: "none",
          outModes: { default: "out" },
        },
      },
    }),
    [],
  );

  return init ? (
    <Particles
      id={id}
      className="absolute inset-0 z-0 pointer-events-none mask-[linear-gradient(#000_0%,#0000_100%)]"
      options={options}
    />
  ) : null;
};

export default StarsBackground;
