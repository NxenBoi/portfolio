import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

function Roblox() {
  const ref = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      rotationY: 180,
      rotationX: 45,
      scale: 0.5,
      opacity: 0,
      duration: 1.5,
      ease: "expo.out",
    });
  });

  return (
    <img
      ref={ref}
      className="w-95 position: absolute z-[-1] opacity-10"
      src="src/assets/roblox.png"
    ></img>
  );
}

export default Roblox;
