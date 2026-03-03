import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../css/App.css";

import Section from "./Section";
import Stack from "./Stack";
import Logo from "./Images/Logo";
import Button from "./Button";
import Roblox from "./Images/Roblox";
import Glow from "./Glow";
import Stars from "./Stars";
import Services from "./Services";
import Examples from "./Examples";
import Title from "./Title";

gsap.registerPlugin(ScrollTrigger);

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
            I script top-quality frameworks for Roblox games, <br></br> focusing on good structure
            and performance.
          </p>
          <Stack direction="row" justify="center" align="center" gap="3">
            <Button id={0} text="Contact" type="primary"></Button>
            <Button id={1} text="Learn More" type="secondary"></Button>
          </Stack>
        </Stack>
      </Section>

      <Section>
        <Stack direction="column" justify="start" align="center" gap="12">
          <Title title="EXAMPLES" />
          <Examples />
        </Stack>
      </Section>

      <Section color="bg-[#040208]">
        <Glow color="bg-purple-500" opacity="opacity-10"></Glow>
        <Stack direction="column" justify="start" align="center" gap="3">
          <Title title="PROMISES" />
          <Services />
        </Stack>
      </Section>
    </>
  );
}

export default App;
