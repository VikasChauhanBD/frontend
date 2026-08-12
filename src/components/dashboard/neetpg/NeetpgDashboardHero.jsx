import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./NeetpgDashboardHero.css";
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

// Per-card period data, mirroring the INI-CET dashboard pattern
const ALLOTMENTS_PERIODS = [
  {
    id: "2025",
    label: "Year",
    value: "2025",
    link: "/dashboard/neetpg-allotments-2025",
  },
  {
    id: "2024",
    label: "Year",
    value: "2024",
    link: "/dashboard/neetpg-allotments-2024",
  },
];

const CLOSING_RANKS_PERIODS = [
  {
    id: "2025",
    label: "Year",
    value: "2025",
    link: "/dashboard/neetpg-closing-ranks-2025",
  },
  {
    id: "2024",
    label: "Year",
    value: "2024",
    link: "/dashboard/neetpg-closing-ranks-2024",
  },
];

const SEAT_MATRIX_PERIODS = [
  {
    id: "2025",
    label: "Year",
    value: "2025",
    link: "/dashboard/neetpg-seat-matrix-2025",
  },
  {
    id: "2024",
    label: "Year",
    value: "2024",
    link: "/dashboard/neetpg-seat-matrix-2024",
  },
];

const FEE_STIPEND_BOND_PERIODS = [
  {
    id: "2025",
    label: "Year",
    value: "2025",
    link: "/dashboard/neetpg-fee-stipend-bond-2025",
  },
  {
    id: "2024",
    label: "Year",
    value: "2024",
    link: "/dashboard/neetpg-fee-stipend-bond-2024",
  },
];

function NeetpgDashboardHero() {
  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const blobRef = useRef([]);
  const pulseRef = useRef(null);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const [activeCard, setActiveCard] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Entrance animation + ambient background motion
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".npgd-hero-eyebrow", { opacity: 0, y: 14, duration: 0.6 })
        .from(
          ".npgd-hero-title .npgd-hero-title-line",
          { opacity: 0, y: 26, duration: 0.75, stagger: 0.08 },
          "-=0.35",
        )
        .from(
          ".npgd-hero-subtitle",
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

      // Ambient floating blobs — soft, slow, continuous
      blobRef.current.forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 26 : -22,
          y: i % 2 === 0 ? -20 : 24,
          duration: 7 + i * 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Vital / pulse line drifting left to right, looping
      if (pulseRef.current) {
        const len = pulseRef.current.getTotalLength();
        gsap.set(pulseRef.current, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
        gsap.to(pulseRef.current, {
          strokeDashoffset: -len,
          duration: 5.5,
          ease: "none",
          repeat: -1,
        });
      }
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
    setSelectedPeriod(null);
  };

  const closeModal = () => {
    if (!modalRef.current || !overlayRef.current) {
      setActiveCard(null);
      return;
    }

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
        ".npgd-hero-period-btn",
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

  const handlePeriodSelect = (period, e) => {
    setSelectedPeriod(period);
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.92 },
      { scale: 1, duration: 0.35, ease: "back.out(3)" },
    );

    setTimeout(() => {
      window.location.href = period.link;
    }, 250);
  };

  // Map each card id to its own dataset
  const currentPeriods = (() => {
    switch (activeCard?.id) {
      case "closing-ranks":
        return CLOSING_RANKS_PERIODS;
      case "seat-matrix":
        return SEAT_MATRIX_PERIODS;
      case "fee-stipend-bond":
        return FEE_STIPEND_BOND_PERIODS;
      case "allotments":
      default:
        return ALLOTMENTS_PERIODS;
    }
  })();

  return (
    <div className="npgd-hero-root" ref={rootRef}>
      {/* Ambient light background */}
      <div className="npgd-hero-bg" aria-hidden="true">
        <span
          className="npgd-hero-blob npgd-hero-blob-a"
          ref={(el) => (blobRef.current[0] = el)}
        />
        <span
          className="npgd-hero-blob npgd-hero-blob-b"
          ref={(el) => (blobRef.current[1] = el)}
        />
        <span
          className="npgd-hero-blob npgd-hero-blob-c"
          ref={(el) => (blobRef.current[2] = el)}
        />
        <svg
          className="npgd-hero-pulse"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            ref={pulseRef}
            d="M0,100 L220,100 L260,40 L300,160 L340,100 L980,100 L1020,50 L1060,150 L1100,100 L1200,100"
            fill="none"
          />
        </svg>
        <div className="npgd-hero-grid" />
      </div>

      <div className="npgd-hero-content">
        <p className="npgd-hero-eyebrow">NEET&nbsp;PG COUNSELING</p>
        <h1 className="npgd-hero-title">
          <span className="npgd-hero-title-line">Your admission vitals,</span>
          <span className="npgd-hero-title-line npgd-hero-title-accent">
            tracked live.
          </span>
        </h1>
        <p className="npgd-hero-subtitle">
          Allotments, closing ranks, seat matrix and cost of study — pick a
          card, choose a year, see the numbers.
        </p>

        <div className="npgd-hero-cards">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              className="npgd-hero-card"
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseEnter={(e) => handleCardEnter(e.currentTarget)}
              onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
              onClick={() => openModal(card)}
              type="button"
            >
              <span className="npgd-hero-card-icon">
                <card.Icon />
              </span>
              <span className="npgd-hero-card-title">{card.title}</span>
              <span className="npgd-hero-card-desc">{card.desc}</span>
              <span className="npgd-hero-card-cta">
                View data
                <FiArrowRight />
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeCard && (
        <div
          className="npgd-hero-overlay"
          ref={overlayRef}
          onClick={closeModal}
        >
          <div
            className="npgd-hero-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={activeCard.title}
          >
            <button
              className="npgd-hero-modal-close"
              onClick={closeModal}
              aria-label="Close"
              type="button"
            >
              <FiX />
            </button>

            <span className="npgd-hero-modal-icon">
              <activeCard.Icon />
            </span>

            <h2 className="npgd-hero-modal-title">{activeCard.title}</h2>
            <p className="npgd-hero-modal-hint">
              {activeCard.id === "allotments" ? "Select round" : "Select year"}
            </p>

            <div className="npgd-hero-period-list">
              {currentPeriods.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  className={
                    "npgd-hero-period-btn" +
                    (selectedPeriod?.id === period.id
                      ? " npgd-hero-period-btn-active"
                      : "")
                  }
                  onClick={(e) => handlePeriodSelect(period, e)}
                >
                  <span className="npgd-hero-period-label">{period.label}</span>
                  <span className="npgd-hero-period-value">{period.value}</span>
                </button>
              ))}
            </div>

            {selectedPeriod && (
              <p className="npgd-hero-modal-footnote">
                Opening {activeCard.title.toLowerCase()} for{" "}
                {selectedPeriod.label} {selectedPeriod.value}.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NeetpgDashboardHero;
