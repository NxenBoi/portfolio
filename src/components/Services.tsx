import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Stack from "./Stack";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: "fa-sitemap",
    title: "Modular & Scalable Frameworks",
    description:
      "My code follows an organized and modular structure, built to be easily mantained and expanded in the future.",
  },
  {
    icon: "fa-database",
    title: "Stable Data Storing & Handling",
    description:
      "I make reliable data saving systems to securely store and manage player data and game states.",
  },
  {
    icon: "fa-shield-halved",
    title: "Fast & Secure Networking",
    description:
      "I ensure responsive and secure client-server communication, preventing exploits and minimizing clunkiness.",
  },
  {
    icon: "fa-pen-ruler",
    title: "UI Logic and Animation",
    description:
      "I can script complex user interfaces and add fluid animations that make them feel more lively.",
  },
  {
    icon: "fa-gamepad",
    title: "Smooth Gameplay Mechanics",
    description:
      "I have a high standard for quality and every feature I script will be polished to its full potential.",
  },
  {
    icon: "fa-rocket",
    title: "Solid Optimization",
    description:
      "I plan and optimize scripts to maximize performance, ensuring a smooth experience on all devices.",
  },
];

function Services() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".service-card", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".service-card",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".service-card");

      cards.forEach((card) => {
        const glow = card.querySelector(".hover-glow") as HTMLElement;

        card.addEventListener("mousemove", () => {
          gsap.to(card, {
            scale: 1.02,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            duration: 0.5,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(glow, { opacity: 0, duration: 0.4 });
          gsap.to(card, {
            scale: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            duration: 0.5,
          });
        });
      });
    },
    { scope: container },
  );

  return (
    <Stack
      ref={container}
      direction="column"
      justify="center"
      align="center"
      gap="5"
      className="py-12"
    >
      <h1 className="text-3xl font-bold text-white opacity-50 text-center mb-8 code">
        My Services
      </h1>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-4 ">
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-left"
          >
            <div className="text-3xl text-white mb-4">
              <i className={`fas ${service.icon}`}></i>
            </div>
            <h3 className="text-[18px] text-white mb-2 code pointer-events-none">
              {service.title}
            </h3>
            <p className="text-[16px] font-normal text-white opacity-30 pointer-events-none">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </Stack>
  );
}

export default Services;
