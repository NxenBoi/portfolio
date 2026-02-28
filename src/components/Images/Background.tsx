import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

function Background() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      duration: 1,
      ease: "sine.inOut",
    });
  });

  return (
    <div
      ref={ref}
      className="background w-full h-full opacity-55 blur-[10px]
      bg-[url('src/assets/bg.jpg')] bg-cover bg-center
      mask-[linear-gradient(#000_0%,#00000016_75%,#0000_100%)] absolute"
    ></div>
  );
}

export default Background;
