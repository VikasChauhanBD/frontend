import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./DataAdvantage.css";

gsap.registerPlugin(ScrollTrigger);

const analysisItems = [
  "Previous-year closing ranks",
  "Round-wise seat movement",
  "AIQ & State counselling trends",
  "Seat matrix",
  "College preferences",
  "Fee structures",
  "Bond & service obligations",
  "Stipend information",
];

const DataAdvantage = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      introTl
        .from(".data-heading", {
          opacity: 0,
          y: 45,
          duration: 0.8,
          ease: "power4.out",
        })
        .from(
          ".data-subheading",
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.35",
        )
        .from(
          ".data-intro",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4",
        );

      // Analysis cards
      gsap.from(".analysis-card", {
        opacity: 0,
        y: 45,
        scale: 0.94,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".analysis-grid",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      // Decorative center line
      gsap.fromTo(
        ".analysis-line",
        {
          scaleY: 0,
        },
        {
          scaleY: 1,
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".analysis-grid",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Bottom statement
      gsap.from(".data-statement", {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".data-statement",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      // CTA
      gsap.from(".data-cta", {
        opacity: 0,
        y: 25,
        scale: 0.95,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".data-cta",
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });

      // Floating decorative elements
      gsap.to(".data-orb-one", {
        y: -18,
        x: 8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".data-orb-two", {
        y: 15,
        x: -10,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Small dots animation
      gsap.to(".data-dot-decoration", {
        scale: 1.4,
        opacity: 0.35,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="data-advantage" ref={sectionRef}>
      {/* Decorative background */}
      <div className="data-bg-grid" />

      <div className="data-orb data-orb-one" />
      <div className="data-orb data-orb-two" />

      <span className="data-dot-decoration dot-one" />
      <span className="data-dot-decoration dot-two" />
      <span className="data-dot-decoration dot-three" />

      <div className="data-wrapper">
        <div className="data-header">
          <h2 className="data-heading">
            The Believers Data
            <span className="data-heading-highlight">Advantage</span>
          </h2>

          <h3 className="data-subheading">Reliable Data. Better Decisions.</h3>

          <p className="data-intro">
            Every recommendation is supported by data,
            <br />
            analysis and experience.
          </p>
        </div>

        <div className="analysis-section">
          <div className="analysis-heading">
            <span className="analysis-heading-number">01</span>

            <span className="analysis-heading-text">We analyse:</span>
          </div>

          <div className="analysis-layout">
            <div className="analysis-line" />

            <div className="analysis-grid">
              {analysisItems.map((item, index) => (
                <div className="analysis-card" key={item}>
                  <span className="analysis-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="analysis-card-dot" />

                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="data-statement">
          <div className="statement-accent" />

          <div className="statement-content">
            <p className="statement-main">
              <strong>Data tells you where you can get a seat.</strong>
            </p>

            <p className="statement-main">
              <strong>Expertise helps you choose the right one.</strong>
            </p>

            <p className="statement-final">
              At Believers, we bring both together.
            </p>
          </div>

          <div className="statement-mark">+</div>
        </div>

        <button className="data-cta" type="button">
          <span>Explore Counselling Insights</span>

          <span className="data-cta-arrow">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 9H15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M10 4L15 9L10 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
};

export default DataAdvantage;
