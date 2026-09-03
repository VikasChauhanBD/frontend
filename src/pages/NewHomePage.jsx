import React from "react";
import HeroSection from "../components/ui/newHome/HeroSection";
import MentorSection from "../components/ui/newHome/MentorSection";
import EverythingSection from "../components/ui/newHome/EverythingSection";
import Chaos from "../components/ui/newHome/Chaos";
import WhyBelievers from "../components/ui/newHome/WhyBelievers";

function NewHomePage() {
  return (
    <div>
      <HeroSection />
      <MentorSection />
      <EverythingSection />
      <Chaos />
      {/* <WhyBelievers /> */}
    </div>
  );
}

export default NewHomePage;
