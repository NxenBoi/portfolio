import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import "../css/App.css";

import Section from "./Section";
import Stack from "./Stack";
import Logo from "./Images/Logo";
import Button from "./Button";
import Roblox from "./Images/Roblox";
import Glow from "./Glow";
import Stars from "./Stars";
import Services from "./Services";

function App() {
  useGSAP(() => {
    gsap.from(".p-fade", {
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
    });
  });

  return (
    <>
      <Section>
        <Stars></Stars>

        <Roblox></Roblox>
        <Stack direction="column" justify="start" align="center">
          <p className="code p-fade">
            <i className="fa-regular fa-circle-check"></i> available
          </p>
          <Logo></Logo>
          <p className="text-center p-fade">
            I script top-quality frameworks for Roblox games, <br></br> focusing
            on good structure and performance.
          </p>
          <Stack direction="row" justify="center" align="center" gap="3">
            <Button id={0} text="Contact" type="primary"></Button>
            <Button id={1} text="Learn More" type="secondary"></Button>
          </Stack>
        </Stack>
      </Section>

      <Section color="bg-[#040208]">
        <Glow
          color="bg-purple-500"
          opacity="opacity-10"
          className="-left-20 -top-20"
        ></Glow>

        <Glow
          color="bg-violet-500"
          opacity="opacity-8"
          className="-right-20 -bottom-20"
        ></Glow>

        <Services />
      </Section>

      <Section />
    </>
  );
}

export default App;
