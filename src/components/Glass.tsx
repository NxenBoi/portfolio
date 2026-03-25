import React, { type ElementType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface Props {
  className: string;
  tinted?: boolean;
  children?: React.ReactNode;
  as?: ElementType;
  [key: string]: unknown;
}

function Glass({ className, tinted, children, as: Component = "div", ...props }: Props) {
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

  const newClassName = `${tinted ? "bg-black/25" : "bg-white/5"} backdrop-blur-xl border border-white/5 rounded-lg text-center items-center justify-center relative flex overflow-hidden ${className}`;

  return (
    <Component ref={ref} className={newClassName} {...props}>
      {children}
    </Component>
  );
}

export default Glass;
