import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface Props {
  title: string;
}

export default function Title({ title }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
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
    <h1 ref={ref} className="text-3xl font-bold text-white opacity-50 text-center">
      {title}
    </h1>
  );
}
