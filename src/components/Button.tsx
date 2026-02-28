import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

interface Props {
  text: string;
  type: "primary" | "secondary";
  id?: number;
}

const colorsMap = {
  primary: { bg: "bg-[#ffffff]", text: "text-black" },
  secondary: { bg: "bg-[#333]", text: "text-white" },
};

function Button({ text, type, id }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      rotate: -15,
      duration: 1,
      ease: "back",
      delay: (id ?? 0) * 0.1 + 0.2,
    });
  });

  const className = `${colorsMap[type].bg} ${colorsMap[type].text}  py-1.5 px-2.5 rounded-full my-5 text-[14px]`;
  return (
    <button ref={ref} className={className}>
      {text}
    </button>
  );
}
export default Button;
