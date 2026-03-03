import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import React, { useRef } from "react";

interface GlowProps {
  color?: string;
  size?: string;
  blur?: string;
  opacity?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Glow({
  color = "",
  size = "w-[800px] h-[800px]",
  blur = "blur-[150px]",
  opacity = "opacity-100",
  className = "",
  style,
}: GlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
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
      style={style}
      ref={ref}
      className={`
        absolute pointer-events-none rounded-full
        ${color} ${size} ${blur} ${opacity} ${className}
      `}
      aria-hidden="true"
    />
  );
}
