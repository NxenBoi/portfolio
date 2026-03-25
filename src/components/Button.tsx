import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

interface Props {
  text: string;
  type: "primary" | "secondary";
  id?: number;
  destination: string;
}

const colorsMap = {
  primary: { bg: "bg-[#ffffff]", text: "text-black" },
  secondary: { bg: "bg-[#333]", text: "text-white" },
};

function Button({ text, type, id, destination }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  // 1. Entrance Animation (Original)
  useGSAP(
    () => {
      gsap.from(ref.current, {
        opacity: 0,
        rotate: -15,
        duration: 1,
        ease: "back",
        delay: (id ?? 0) * 0.1 + 0.2,
      });
    },
    { scope: ref },
  );

  // 2. GSAP Hover Handlers
  const onMouseEnter = () => {
    gsap.to(ref.current, {
      opacity: 0.8,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const onMouseLeave = () => {
    gsap.to(ref.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.inOut",
    });
  };

  const onMouseDown = () => {
    gsap.to(ref.current, {
      scale: 0.95,
      duration: 0.1,
    });
  };

  const onMouseUp = () => {
    gsap.to(ref.current, {
      scale: 1.02,
      duration: 0.2,
    });
  };

  // 3. Scroll Logic
  const handleScroll = () => {
    // We look for an element with the exact ID passed in destination
    const target = document.getElementById(destination);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`No element found with ID: ${destination}`);
    }
  };

  const className = `${colorsMap[type].bg} ${colorsMap[type].text} py-1.5 px-2.5 rounded-full my-5 text-[14px] cursor-pointer select-none`;

  return (
    <button
      ref={ref}
      className={className}
      onClick={handleScroll}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {text}
    </button>
  );
}

export default Button;
