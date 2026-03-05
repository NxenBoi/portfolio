import { useState, useRef, useEffect } from "react";
import Glass from "./Glass";
import Stack from "./Stack";
import gsap from "gsap";
import Glow from "./Glow";
import { useGSAP } from "@gsap/react";

interface Project {
  id: number;
  name: string;
  types: string[];
  video: string;
  poster: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "FPS & Movement",
    types: ["first person guns", "movement", "wall-running"],
    video: "public/examples/shooter.mp4",
    poster: "public/examples_posters/shooter.webp",
  },
  {
    id: 2,
    name: "Building Plugin",
    types: ["plugin", "procedural generation"],
    video: "public/examples/bp.mp4",
    poster: "public/examples_posters/bp.webp",
  },
];

export default function Examples() {
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);
  const [dynamicColor, setDynamicColor] = useState<string>("rgba(255, 255, 255, 0.1)");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    let frameId: number;

    const canvas = document.createElement("canvas");
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const updateColor = () => {
      if (videoRef.current && videoRef.current.readyState >= 2 && ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 10, 10);
        const imageData = ctx.getImageData(0, 0, 10, 10).data;

        let r = 0,
          g = 0,
          b = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
        }

        const count = imageData.length / 4;
        const avgR = Math.round(r / count);
        const avgG = Math.round(g / count);
        const avgB = Math.round(b / count);

        setDynamicColor(`rgb(${avgR}, ${avgG}, ${avgB})`);
      }
      frameId = requestAnimationFrame(updateColor);
    };

    updateColor();
    return () => cancelAnimationFrame(frameId);
  }, [activeProject]);

  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      duration: 0.5,
      stagger: 0.5,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 100%",
        toggleActions: "play none none reverse",
      },
    });
  });

  return (
    <div ref={ref}>
      <Glow
        style={{ backgroundColor: dynamicColor }}
        opacity="opacity-15"
        className="-left-20 -top-20 transition-colors duration-250 ease-in-out z-0"
      />

      <Glow
        style={{ backgroundColor: dynamicColor }}
        opacity="opacity-15"
        className="-right-20 -bottom-20 transition-colors duration-250 ease-in-out z-0"
      />

      <Stack direction="row" gap="2" align="stretch" className="h-120 z-1">
        <Stack direction="column" gap="2" className="w-1/3 h-full">
          <Glass className="p-4 w-full flex items-center justify-start border-white/10">
            <Stack direction="row" gap="2" align="center" justify="start" className="w-full h-full">
              <div className="bg-red-400 rounded-full w-2.5 h-2.5"></div>
              <div className="bg-amber-400 rounded-full w-2.5 h-2.5"></div>
              <div className="bg-green-400 rounded-full w-2.5 h-2.5"></div>
              <span className="text-[10px] ml-2 uppercase tracking-[0.2em] text-white/40 font-bold">
                BROWSER
              </span>
            </Stack>
          </Glass>

          <Glass className="flex-1 p-0 flex flex-col overflow-hidden">
            <Stack fullWidth gap="1" className="p-2 overflow-y-auto flex-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className={`w-full flex items-center gap-3 px-4 py-1 rounded-lg transition-all duration-200 group ${
                    activeProject.id === project.id
                      ? "bg-white/10 text-white shadow-inner"
                      : "hover:bg-white/5 text-white/50 hover:text-white"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[16px] tracking-tight code">{project.name}</span>
                </button>
              ))}
            </Stack>

            <div className="w-full p-4 border-t border-white/5 text-left bg-black/20">
              <p className="text-[10px] text-white/20 font-mono">
                © 2026 Nxen. All rights reserved.
              </p>
            </div>
          </Glass>
        </Stack>

        <Glass className="flex-1 p-5 overflow-hidden">
          <div className="relative w-full h-full group rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              key={activeProject.video}
              src={activeProject.video}
              poster={activeProject.poster}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-opacity duration-500"
            />

            <div className="absolute top-6 left-8 text-left">
              <h3 className="text-2xl font-bold text-white mb-1 [text-shadow:2px_2px_6px_rgb(0,0,0,0.5)]">
                {activeProject.name}
              </h3>
              <div className="flex gap-2">
                {activeProject.types.map((type) => (
                  <span
                    key={type}
                    style={{ borderColor: `${dynamicColor}88` }}
                    className="text-[9px] [box-shadow:2px_2px_6px_rgb(0,0,0,0.5)] bg-black/60 backdrop-blur-md border px-2 py-0.5 rounded uppercase tracking-tighter text-white/60 transition-colors duration-1000"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Glass>
      </Stack>
    </div>
  );
}
