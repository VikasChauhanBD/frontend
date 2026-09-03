import React from "react";
import HeroSection from "../components/ui/newHome/HeroSection";
import Marquee from "../components/ui/newHome/Marquee";
import EverythingSection from "../components/ui/newHome/EverythingSection";

function NewHomePage() {
  return (
    <div>
      <HeroSection />
      <Marquee />
      <EverythingSection />
    </div>
  );
}

export default NewHomePage;
