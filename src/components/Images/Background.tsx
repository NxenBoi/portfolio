import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

function Background() {
  const ref = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      duration: 1,
      ease: "sine.inOut",
    });
  });

  return (
    <video
      ref={ref}
      src="public/bg.mp4"
      autoPlay
      loop
      muted
      playsInline
      disablePictureInPicture
      className="absolute inset-0 w-full h-full object-cover opacity-55 blur-[10px] scale-[1.05] 
                 mask-[linear-gradient(#000_0%,#0000_100%)] pointer-events-none saturate-150"
    />
  );
}

export default Background;
