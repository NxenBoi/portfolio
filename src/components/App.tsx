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
import Carousel from "./Carousel";
import Game from "./Game";
import ContactCard from "./Contact";
import Navbar from "./Navbar";

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
      <Navbar />

      <Section id="home">
        <Stars></Stars>

        <Roblox></Roblox>
        <Stack direction="column" justify="start" align="center">
          <Logo></Logo>
          <p className="text-center p-fade">
            I script top-quality frameworks for Roblox games, <br></br> focusing on good structure
            and performance.
          </p>
          <Stack direction="row" justify="center" align="center" gap="3">
            <Button destination="contact" id={0} text="Contact" type="primary"></Button>
            <Button destination="examples" id={1} text="Learn More" type="secondary"></Button>
          </Stack>
        </Stack>
      </Section>

      <Section id="examples">
        <Stack direction="column" justify="start" align="center" gap="12">
          <Title title="EXAMPLES" />
          <Examples />
        </Stack>
      </Section>

      <Section id="promises" color="bg-[#040208]">
        <Glow color="bg-purple-500" opacity="opacity-10"></Glow>
        <Stack direction="column" justify="start" align="center" gap="12">
          <Title title="PROMISES" />
          <Services />
        </Stack>
      </Section>

      <Section id="contributions">
        <Glow
          color="bg-red-400"
          opacity="opacity-15"
          className="-left-20 -top-20 transition-colors duration-250 ease-in-out z-0"
        />

        <Glow
          color="bg-red-400"
          opacity="opacity-15"
          className="-right-20 -bottom-20 transition-colors duration-250 ease-in-out z-0"
        />
        <Stack direction="column" justify="start" align="center" gap="12">
          <Title title="CONTRIBUTIONS" />
          <Carousel>
            <Game PlaceId="74168329160622"></Game>
            <Game PlaceId="100576592245399"></Game>
            <Game PlaceId="103109218059402"></Game>
          </Carousel>
        </Stack>
      </Section>

      <Section id="contact">
        <Glow color="bg-violet-500" opacity="opacity-10"></Glow>
        <Stack direction="column" justify="start" align="center" gap="12">
          <Title title="CONTACT" />
          <ContactCard></ContactCard>
        </Stack>
      </Section>
    </>
  );
}

export default App;
