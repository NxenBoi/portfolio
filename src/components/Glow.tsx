import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface GlowProps {
  color?: string;
  size?: string;
  blur?: string;
  opacity?: string;
  className?: string;
}

export default function Glow({
  color = "bg-white",
  size = "w-[800px] h-[800px]",
  blur = "blur-[150px]",
  opacity = "opacity-100",
  className = "",
}: GlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });
  });

  return (
    <div
      ref={ref}
      className={`
        absolute pointer-events-none rounded-full
        ${color} ${size} ${blur} ${opacity} ${className}
      `}
      aria-hidden="true"
    />
  );
}
