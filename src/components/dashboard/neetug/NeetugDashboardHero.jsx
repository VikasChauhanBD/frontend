import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./NeetugDashboardHero.css";
import {
  FiClipboard,
  FiTrendingUp,
  FiGrid,
  FiDollarSign,
  FiArrowRight,
  FiX,
} from "react-icons/fi";

const CARDS = [
  {
    id: "allotments",
    title: "Allotments",
    desc: "Track every round of seat allotment as it is released.",
    Icon: FiClipboard,
  },
  {
    id: "closing-ranks",
    title: "Closing Ranks",
    desc: "Compare the last rank admitted, category-wise.",
    Icon: FiTrendingUp,
  },
  {
    id: "seat-matrix",
    title: "Seat Matrix",
    desc: "See how many seats each institute is offering.",
    Icon: FiGrid,
  },
  {
    id: "fee-stipend-bond",
    title: "Fee, Stipend & Bond",
    desc: "Tuition, monthly stipend and bond terms, side by side.",
    Icon: FiDollarSign,
  },
];

const YEARS = ["2024", "2025"];

function NeetugDashboardHero() {
  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const waveRef = useRef([]);
  const glowRef = useRef([]);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const [activeCard, setActiveCard] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  // Entrance animation + ambient background motion
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".nugd-hero-eyebrow", { opacity: 0, y: 14, duration: 0.6 })
        .from(
          ".nugd-hero-title .nugd-hero-title-line",
          { opacity: 0, y: 26, duration: 0.75, stagger: 0.08 },
          "-=0.35",
        )
        .from(
          ".nugd-hero-subtitle",
          { opacity: 0, y: 16, duration: 0.6 },
          "-=0.4",
        )
        .from(
          cardsRef.current,
          {
            opacity: 0,
            y: 34,
            scale: 0.96,
            duration: 0.65,
            stagger: 0.1,
          },
          "-=0.3",
        );

      // Drifting horizontal wave bands — each scrolls sideways at its own pace
      waveRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { xPercent: 0 });
        gsap.to(el, {
          xPercent: i % 2 === 0 ? -50 : 50,
          duration: 16 + i * 5,
          ease: "none",
          repeat: -1,
        });
      });

      // Pulsing glow orbs — scale/opacity breathing, no position drift
      glowRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          scale: 1.25,
          opacity: 0.7,
          duration: 3.2 + i * 0.9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
          transformOrigin: "50% 50%",
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleCardEnter = (el) => {
    gsap.to(el, { y: -8, scale: 1.02, duration: 0.35, ease: "power2.out" });
  };
  const handleCardLeave = (el) => {
    gsap.to(el, { y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
  };

  const openModal = (card) => {
    setActiveCard(card);
    setSelectedYear(null);
  };

  const closeModal = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      y: 18,
      scale: 0.94,
      duration: 0.28,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setActiveCard(null),
    });
  };

  // Animate modal in whenever it mounts
  useEffect(() => {
    if (activeCard && overlayRef.current && modalRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 26, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
      );
      gsap.fromTo(
        ".nugd-hero-year-btn",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.08,
          delay: 0.1,
          ease: "power2.out",
        },
      );
    }
  }, [activeCard]);

  const handleYearSelect = (year, e) => {
    setSelectedYear(year);
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.92 },
      { scale: 1, duration: 0.35, ease: "back.out(3)" },
    );
  };

  return (
    <div className="nugd-hero-root" ref={rootRef}>
      {/* Ambient light background */}
      <div className="nugd-hero-bg" aria-hidden="true">
        <svg
          className="nugd-hero-waves"
          viewBox="0 0 2400 400"
          preserveAspectRatio="none"
        >
          <path
            ref={(el) => (waveRef.current[0] = el)}
            className="nugd-hero-wave nugd-hero-wave-a"
            d="M0,260 C200,200 400,320 600,260 C800,200 1000,320 1200,260 C1400,200 1600,320 1800,260 C2000,200 2200,320 2400,260 L2400,400 L0,400 Z"
          />
          <path
            ref={(el) => (waveRef.current[1] = el)}
            className="nugd-hero-wave nugd-hero-wave-b"
            d="M0,300 C220,350 420,250 640,300 C860,350 1060,250 1280,300 C1500,350 1700,250 1920,300 C2140,350 2340,250 2400,300 L2400,400 L0,400 Z"
          />
          <path
            ref={(el) => (waveRef.current[2] = el)}
            className="nugd-hero-wave nugd-hero-wave-c"
            d="M0,340 C260,300 460,370 700,340 C940,310 1140,370 1380,340 C1620,310 1820,370 2060,340 C2200,320 2320,350 2400,340 L2400,400 L0,400 Z"
          />
        </svg>
        <span
          className="nugd-hero-glow nugd-hero-glow-a"
          ref={(el) => (glowRef.current[0] = el)}
        />
        <span
          className="nugd-hero-glow nugd-hero-glow-b"
          ref={(el) => (glowRef.current[1] = el)}
        />
        <span
          className="nugd-hero-glow nugd-hero-glow-c"
          ref={(el) => (glowRef.current[2] = el)}
        />
        <div className="nugd-hero-grid" />
      </div>

      <div className="nugd-hero-content">
        <p className="nugd-hero-eyebrow">NEET&nbsp;UG COUNSELING</p>
        <h1 className="nugd-hero-title">
          <span className="nugd-hero-title-line">Your admission vitals,</span>
          <span className="nugd-hero-title-line nugd-hero-title-accent">
            tracked live.
          </span>
        </h1>
        <p className="nugd-hero-subtitle">
          Allotments, closing ranks, seat matrix and cost of study — pick a
          card, choose a year, see the numbers.
        </p>

        <div className="nugd-hero-cards">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              className="nugd-hero-card"
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseEnter={(e) => handleCardEnter(e.currentTarget)}
              onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
              onClick={() => openModal(card)}
              type="button"
            >
              <span className="nugd-hero-card-icon">
                <card.Icon />
              </span>
              <span className="nugd-hero-card-title">{card.title}</span>
              <span className="nugd-hero-card-desc">{card.desc}</span>
              <span className="nugd-hero-card-cta">
                View data
                <FiArrowRight />
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeCard && (
        <div
          className="nugd-hero-overlay"
          ref={overlayRef}
          onClick={closeModal}
        >
          <div
            className="nugd-hero-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={activeCard.title}
          >
            <button
              className="nugd-hero-modal-close"
              onClick={closeModal}
              aria-label="Close"
              type="button"
            >
              <FiX />
            </button>

            <span className="nugd-hero-modal-icon">
              <activeCard.Icon />
            </span>

            <h2 className="nugd-hero-modal-title">{activeCard.title}</h2>
            <p className="nugd-hero-modal-hint">Select year</p>

            <div className="nugd-hero-year-list">
              {YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={
                    "nugd-hero-year-btn" +
                    (selectedYear === year ? " nugd-hero-year-btn-active" : "")
                  }
                  onClick={(e) => handleYearSelect(year, e)}
                >
                  <span className="nugd-hero-year-label">Year</span>
                  <span className="nugd-hero-year-value">{year}</span>
                </button>
              ))}
            </div>

            {selectedYear && (
              <p className="nugd-hero-modal-footnote">
                Showing {activeCard.title.toLowerCase()} for {selectedYear}.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NeetugDashboardHero;
