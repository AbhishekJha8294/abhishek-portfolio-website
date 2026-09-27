import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Flagship } from "@/components/sections/flagship";
import { Hero } from "@/components/sections/hero";
import { Principles } from "@/components/sections/principles";
import { SignalStrip } from "@/components/sections/signal-strip";
import { Systems } from "@/components/sections/systems";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SignalStrip />
      <Flagship />
      <Systems />
      <Principles />
      <Experience />
      <Contact />
    </>
  );
}
