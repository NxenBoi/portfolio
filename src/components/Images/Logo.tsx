import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

function Logo() {
  const ref = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
    });
  });

  return (
    <img
      ref={ref}
      src="src/assets/logo.png"
      className="w-70 drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]"
    />
  );
}

export default Logo;
