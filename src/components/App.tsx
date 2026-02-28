import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Section from "./Section";
import Background from "./Images/Background";
import Stack from "./Stack";
import Logo from "./Images/Logo";
import Button from "./Button";
import Roblox from "./Images/Roblox";

import "../css/App.css";

function App() {
  useGSAP(() => {
    gsap.from("p", {
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
    });
  });

  return (
    <>
      <Section>
        <Background></Background>
        <Roblox></Roblox>
        <Stack direction="column" justify="start" align="center">
          <p className="code">
            <i className="fa-regular fa-circle-check"></i> available
          </p>
          <Logo></Logo>
          <p className="text-center">
            I make top-quality frameworks for Roblox games, <br></br> focusing
            on good structure and performance.
          </p>
          <Stack direction="row" justify="center" align="center" gap="3">
            <Button id={0} text="Contact" type="primary"></Button>
            <Button id={1} text="Learn More" type="secondary"></Button>
          </Stack>
        </Stack>
      </Section>
    </>
  );
}

export default App;
