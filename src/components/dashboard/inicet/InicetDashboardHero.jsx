import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./InicetDashboardHero.css";
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

const PERIODS = [
  { id: "jul-2026", label: "Jul", value: "2026" },
  { id: "jan-2026", label: "Jan", value: "2026" },
  { id: "jul-2025", label: "Jul", value: "2025" },
  { id: "jan-2025", label: "Jan", value: "2025" },
];

function InicetDashboardHero() {
  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);
  const particleRef = useRef([]);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const [activeCard, setActiveCard] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Entrance animation + ambient background motion
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".inch-hero-eyebrow", { opacity: 0, y: 14, duration: 0.6 })
        .from(
          ".inch-hero-title .inch-hero-title-line",
          { opacity: 0, y: 26, duration: 0.75, stagger: 0.08 },
          "-=0.35",
        )
        .from(
          ".inch-hero-subtitle",
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

      // Ambient rotating orbit rings — slow, continuous, opposite directions
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          rotation: 360,
          duration: 42,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      }
      if (ring2Ref.current) {
        gsap.to(ring2Ref.current, {
          rotation: -360,
          duration: 58,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      }

      // Drifting particle field — soft up/down/side float, staggered
      particleRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          x: i % 3 === 0 ? 18 : i % 3 === 1 ? -14 : 10,
          y: i % 2 === 0 ? -22 : 20,
          duration: 5 + (i % 5) * 1.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.15,
        });
        gsap.to(el, {
          opacity: 0.25,
          duration: 3 + (i % 4),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.2,
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
    setSelectedPeriod(null);
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
        ".inch-hero-period-btn",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
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
  };

  return (
    <div className="inch-hero-root" ref={rootRef}>
      {/* Ambient light background */}
      <div className="inch-hero-bg" aria-hidden="true">
        <span className="inch-hero-ring inch-hero-ring-a" ref={ringRef} />
        <span className="inch-hero-ring inch-hero-ring-b" ref={ring2Ref} />
        <div className="inch-hero-particles">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className={`inch-hero-particle inch-hero-particle-${(i % 4) + 1}`}
              ref={(el) => (particleRef.current[i] = el)}
            />
          ))}
        </div>
        <div className="inch-hero-grid" />
      </div>

      <div className="inch-hero-content">
        <p className="inch-hero-eyebrow">INI-CET COUNSELING</p>
        <h1 className="inch-hero-title">
          <span className="inch-hero-title-line">Your admission vitals,</span>
          <span className="inch-hero-title-line inch-hero-title-accent">
            tracked live.
          </span>
        </h1>
        <p className="inch-hero-subtitle">
          Allotments, closing ranks, seat matrix and cost of study — pick a
          card, choose a round, see the numbers.
        </p>

        <div className="inch-hero-cards">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              className="inch-hero-card"
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseEnter={(e) => handleCardEnter(e.currentTarget)}
              onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
              onClick={() => openModal(card)}
              type="button"
            >
              <span className="inch-hero-card-icon">
                <card.Icon />
              </span>
              <span className="inch-hero-card-title">{card.title}</span>
              <span className="inch-hero-card-desc">{card.desc}</span>
              <span className="inch-hero-card-cta">
                View data
                <FiArrowRight />
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeCard && (
        <div
          className="inch-hero-overlay"
          ref={overlayRef}
          onClick={closeModal}
        >
          <div
            className="inch-hero-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={activeCard.title}
          >
            <button
              className="inch-hero-modal-close"
              onClick={closeModal}
              aria-label="Close"
              type="button"
            >
              <FiX />
            </button>

            <span className="inch-hero-modal-icon">
              <activeCard.Icon />
            </span>

            <h2 className="inch-hero-modal-title">{activeCard.title}</h2>
            <p className="inch-hero-modal-hint">Select round</p>

            <div className="inch-hero-period-list">
              {PERIODS.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  className={
                    "inch-hero-period-btn" +
                    (selectedPeriod?.id === period.id
                      ? " inch-hero-period-btn-active"
                      : "")
                  }
                  onClick={(e) => handlePeriodSelect(period, e)}
                >
                  <span className="inch-hero-period-label">{period.label}</span>
                  <span className="inch-hero-period-value">{period.value}</span>
                </button>
              ))}
            </div>

            {selectedPeriod && (
              <p className="inch-hero-modal-footnote">
                Showing {activeCard.title.toLowerCase()} for{" "}
                {selectedPeriod.label} {selectedPeriod.value}.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InicetDashboardHero;
