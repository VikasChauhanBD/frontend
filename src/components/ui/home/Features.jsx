import React, { useRef } from "react";
import "./Features.css";

import {
  FaChartLine,
  FaUniversity,
  FaCalculator,
  FaVideo,
  FaTools,
  FaClipboardCheck,
  FaArrowRight,
} from "react-icons/fa";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Cut-offs & Seat Matrix",
    description:
      "Explore cut-offs across years & rounds to predict your best possible range of colleges. Sometimes you get your best college not in the first round but in the second.",
    icon: <FaChartLine />,
    color: "#155dfc",
    bg: "#eef4ff",
  },
  {
    title: "Fee, Stipend & Bond",
    description:
      "From course fees, penalties to hostel costs, we've got the numbers covered. For PGs, know your stipend and service bond obligations in advance.",
    icon: <FaUniversity />,
    color: "#7c3aed",
    bg: "#f5f0ff",
  },
  {
    title: "Multi Rank-Predictors",
    description:
      "Should you upgrade? Will you lose your seat? Is it worth the penalty?",
    icon: <FaCalculator />,
    color: "#f97316",
    bg: "#fff4eb",
  },
  {
    title: "Webinars & Live Doubt Sessions",
    description:
      "Get expert strategies and answers - tailored for each counselling and round.",
    icon: <FaVideo />,
    color: "#06b6d4",
    bg: "#ecfeff",
  },
  {
    title: "Advanced Tools",
    description: "Know every seat, every movement, who got admitted where.",
    icon: <FaTools />,
    color: "#16a34a",
    bg: "#edfdf2",
  },
  {
    title: "INICET Live Results 2026",
    description:
      "Check ranks, cutoffs, seat matrix, and counselling schedule for INICET Jan 2026. Get institute-wise data.",
    icon: <FaClipboardCheck />,
    color: "#e11d48",
    bg: "#fff1f5",
  },
];

function Features() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".feature-heading", {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".feature-heading",
          start: "top 80%",
        },
      });

      gsap.utils.toArray(".feature-card").forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 100,
          scale: 0.9,
          rotateX: 20,
          duration: 1,
          delay: index * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.to(".floating-dot", {
        y: -15,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        duration: 2,
        ease: "sine.inOut",
      });

      ScrollTrigger.refresh();
    },
    { scope: sectionRef },
  );

  return (
    <section className="feature-section" ref={sectionRef}>
      <span className="floating-dot dot1"></span>
      <span className="floating-dot dot2"></span>
      <span className="floating-dot dot3"></span>

      <div className="feature-container">
        <div className="feature-heading">
          <h2> Say hello to Believers Consultancy</h2>
          <p>The most effective way to choose your best seat.</p>
        </div>

        <div className="feature-grid">
          {features.map((item, index) => (
            <div
              className="feature-card"
              key={index}
              style={{
                "--accent": item.color,
                "--bg": item.bg,
              }}
            >
              <div className="icon-box">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
