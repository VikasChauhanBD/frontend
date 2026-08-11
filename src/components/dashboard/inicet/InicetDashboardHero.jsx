import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./InicetDashboardHero.css";
import { FiClipboard, FiTrendingUp, FiArrowRight, FiX } from "react-icons/fi";

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
];

const ALLOTMENTS_PERIODS = [
  {
    id: "jul-2026",
    label: "Jul",
    value: "2026",
    link: "/dashboard/inicet-allotments-july-2026",
  },
  {
    id: "jan-2026",
    label: "Jan",
    value: "2026",
    link: "/dashboard/inicet-allotments-jan-2026",
  },
  {
    id: "jul-2025",
    label: "Jul",
    value: "2025",
    link: "/dashboard/inicet-allotments-july-2025",
  },
  {
    id: "jan-2025",
    label: "Jan",
    value: "2025",
    link: "/dashboard/inicet-allotments-jan-2025",
  },
];

const CLOSING_RANK_PERIODS = [
  {
    id: "2026",
    label: "Year",
    value: "2026",
    link: "/dashboard/inicet-closing-ranks-2026",
  },
  {
    id: "2025",
    label: "Year",
    value: "2025",
    link: "/dashboard/inicet-closing-ranks-2025",
  },
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".inid-hero-eyebrow", {
        opacity: 0,
        y: 14,
        duration: 0.6,
      })
        .from(
          ".inid-hero-title .inid-hero-title-line",
          {
            opacity: 0,
            y: 26,
            duration: 0.75,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .from(
          ".inid-hero-subtitle",
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
          },
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
    gsap.to(el, {
      y: -8,
      scale: 1.02,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleCardLeave = (el) => {
    gsap.to(el, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
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

  useEffect(() => {
    if (activeCard && overlayRef.current && modalRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          y: 26,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.6)",
        },
      );

      gsap.fromTo(
        ".inid-hero-period-btn",
        {
          opacity: 0,
          y: 10,
        },
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
      {
        scale: 1,
        duration: 0.35,
        ease: "back.out(3)",
      },
    );

    setTimeout(() => {
      window.location.href = period.link;
    }, 250);
  };

  const currentPeriods =
    activeCard?.id === "closing-ranks"
      ? CLOSING_RANK_PERIODS
      : ALLOTMENTS_PERIODS;

  return (
    <div className="inid-hero-root" ref={rootRef}>
      <div className="inid-hero-bg" aria-hidden="true">
        <span className="inid-hero-ring inid-hero-ring-a" ref={ringRef} />
        <span className="inid-hero-ring inid-hero-ring-b" ref={ring2Ref} />

        <div className="inid-hero-particles">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className={`inid-hero-particle inid-hero-particle-${(i % 4) + 1}`}
              ref={(el) => (particleRef.current[i] = el)}
            />
          ))}
        </div>

        <div className="inid-hero-grid" />
      </div>

      <div className="inid-hero-content">
        <p className="inid-hero-eyebrow">INI-CET COUNSELING</p>

        <h1 className="inid-hero-title">
          <span className="inid-hero-title-line">Your admission vitals,</span>

          <span className="inid-hero-title-line inid-hero-title-accent">
            tracked live.
          </span>
        </h1>

        <p className="inid-hero-subtitle">
          Allotments, closing ranks, seat matrix and cost of study — pick a
          card, choose a round, see the numbers.
        </p>

        <div className="inid-hero-cards">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              className="inid-hero-card"
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseEnter={(e) => handleCardEnter(e.currentTarget)}
              onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
              onClick={() => openModal(card)}
              type="button"
            >
              <span className="inid-hero-card-icon">
                <card.Icon />
              </span>

              <span className="inid-hero-card-title">{card.title}</span>

              <span className="inid-hero-card-desc">{card.desc}</span>

              <span className="inid-hero-card-cta">
                View data
                <FiArrowRight />
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeCard && (
        <div
          className="inid-hero-overlay"
          ref={overlayRef}
          onClick={closeModal}
        >
          <div
            className="inid-hero-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={activeCard.title}
          >
            <button
              className="inid-hero-modal-close"
              onClick={closeModal}
              aria-label="Close"
              type="button"
            >
              <FiX />
            </button>

            <span className="inid-hero-modal-icon">
              <activeCard.Icon />
            </span>

            <h2 className="inid-hero-modal-title">{activeCard.title}</h2>

            <p className="inid-hero-modal-hint">
              {activeCard.id === "closing-ranks"
                ? "Select year"
                : "Select round"}
            </p>

            <div className="inid-hero-period-list">
              {currentPeriods.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  className={
                    "inid-hero-period-btn" +
                    (selectedPeriod?.id === period.id
                      ? " inid-hero-period-btn-active"
                      : "")
                  }
                  onClick={(e) => handlePeriodSelect(period, e)}
                >
                  <span className="inid-hero-period-label">{period.label}</span>

                  <span className="inid-hero-period-value">{period.value}</span>
                </button>
              ))}
            </div>

            {selectedPeriod && (
              <p className="inid-hero-modal-footnote">
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

export default InicetDashboardHero;
