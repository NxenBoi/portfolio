import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface GlowProps {
  color?: string; // e.g., "bg-blue-500"
  size?: string; // e.g., "w-[500px] h-[500px]"
  blur?: string; // e.g., "blur-[120px]"
  opacity?: string; // e.g., "opacity-20"
  className?: string; // For positioning (e.g., "-top-20 -left-20")
}

export default function Glow({
  color = "bg-gray-500",
  size = "w-[600px] h-[600px]",
  blur = "blur-[150px]",
  opacity = "opacity-20",
  className = "",
}: GlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  // Subtle breathing animation to make it "lively"
  useGSAP(() => {
    gsap.to(glowRef.current, {
      scale: 1.2,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return (
    <div
      ref={glowRef}
      className={`
        absolute pointer-events-none rounded-full -z-10
        ${color} ${size} ${blur} ${opacity} ${className}
      `}
      aria-hidden="true"
    />
  );
}
