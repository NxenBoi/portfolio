import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface Props {
  className: string;
  children?: React.ReactNode;
}

function Glass({ className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 20,
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
    <div
      ref={ref}
      className={`bg-white/5 backdrop-blur-lg border border-white/5 rounded-xl text-center items-center justify-center relative flex overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export default Glass;
