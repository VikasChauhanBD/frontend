import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./InicetDashboardInfo.css";
import {
  FiCheckCircle,
  FiChevronRight,
  FiChevronDown,
  FiFileText,
  FiExternalLink,
  FiInfo,
  FiTarget,
  FiHome,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- Data ---------------- */

const EXAM_HIGHLIGHTS = [
  { title: "Conducting Body", desc: "AIIMS New Delhi" },
  { title: "Exam Mode", desc: "Computer-Based Test (CBT)" },
  { title: "Frequency", desc: "Twice a Year (January & July)" },
  { title: "Duration", desc: "3 Hours (180 Minutes)" },
];

const PARTICIPATING_INSTITUTES = [
  "AIIMS New Delhi",
  "JIPMER Puducherry",
  "PGIMER Chandigarh",
  "NIMHANS Bangalore",
  "SCTIMST Trivandrum",
  "All other AIIMS Institutes",
];

const PHASES = [
  {
    roman: "I",
    title: "Application",
    band: "inid-info-phase-band-a",
    steps: [
      { title: "Registration & Basic Candidate Information" },
      {
        title: "Generation of Exam Unique Code (EUC)",
        desc: "for applying for January 2024 Session",
      },
      {
        title: "Completion of Application",
        desc: "(Application for January 2024 Session)",
      },
    ],
  },
  {
    roman: "II",
    title: "Examination",
    band: "inid-info-phase-band-b",
    steps: [
      { title: "Admit Card" },
      { title: "Computer Based Test" },
      { title: "Declaration of Results" },
      { title: "Invitation of choices & order of preference" },
    ],
  },
  {
    roman: "III",
    title: "Seat Allocation",
    band: "inid-info-phase-band-c",
    steps: [
      { title: "Mock Round » 1st Round" },
      { title: "2nd Round" },
      { title: "Additional Rounds (if needed)" },
      { title: "Open Round (if needed)" },
      { title: "Spot Round (if needed)" },
    ],
  },
];

const AIIMS_CUTOFFS = [
  { name: "AIIMS New Delhi", opening: "109", closing: "2212" },
  { name: "AIIMS Bathinda", opening: "119", closing: "2058" },
  { name: "AIIMS Bhopal", opening: "840", closing: "1351" },
  { name: "AIIMS Bhubaneswar", opening: "202", closing: "1104" },
  { name: "AIIMS Bibinagar", opening: "1164", closing: "1164" },
  { name: "AIIMS Bilaspur", opening: "515", closing: "1445" },
  { name: "AIIMS Deoghar", opening: "1107", closing: "1508" },
  { name: "AIIMS Gorakhpur", opening: "1071", closing: "2133" },
  { name: "AIIMS Guwahati", opening: "566", closing: "1487" },
  { name: "AIIMS Jodhpur", opening: "26", closing: "1029" },
  { name: "AIIMS Kalyani", opening: "209", closing: "1178" },
  { name: "AIIMS Mangalagiri", opening: "347", closing: "1863" },
  { name: "AIIMS Nagpur", opening: "542", closing: "1279" },
  { name: "AIIMS Patna", opening: "206", closing: "871" },
  { name: "AIIMS Raebareli", opening: "256", closing: "1255" },
  { name: "AIIMS Raipur", opening: "74", closing: "1170" },
  { name: "AIIMS Rajkot", opening: "101", closing: "1080" },
  { name: "AIIMS Rishikesh", opening: "105", closing: "1200" },
];

function InicetDashboardInfo() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".inid-info-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".inid-info-reveal"), {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 82%" },
        });
      });

      gsap.from(".inid-info-phase-card", {
        opacity: 0,
        y: 24,
        duration: 0.55,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".inid-info-process-grid", start: "top 80%" },
      });

      gsap.utils.toArray(".inid-info-table-wrap").forEach((wrap) => {
        gsap.from(wrap.querySelectorAll("tbody tr"), {
          opacity: 0,
          x: -16,
          duration: 0.45,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: { trigger: wrap, start: "top 80%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="inid-info-root" ref={rootRef}>
      <div className="inid-info-resource-bar">
        <a
          href="https://static.collegedekho.com/media/uploads/2025/11/24/1763125732925-114509804.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inid-info-resource-link"
        >
          <FiFileText />
          Final Seat Position for admission to PG courses of INIs — INI-CET
          January 2026 session
          <FiExternalLink />
        </a>
      </div>

      <section className="inid-info-section inid-info-bg-white">
        <div className="inid-info-section-inner">
          <div className="inid-info-header-center">
            <span className="inid-info-eyebrow inid-info-reveal">
              <span className="inid-info-eyebrow-dot" />
              Exam Overview
            </span>
            <h2 className="inid-info-heading inid-info-reveal">
              What is <span className="inid-info-heading-accent">INI-CET</span>?
            </h2>
            <p className="inid-info-para inid-info-reveal">
              INI-CET (Institute of National Importance Combined Entrance Test)
              is a national-level entrance examination conducted for admission
              to postgraduate medical courses (MD/MS/DM/M.Ch/MDS) at AIIMS and
              other Institutes of National Importance.
            </p>
          </div>

          <div className="inid-info-info-grid inid-info-reveal">
            <div className="inid-info-info-card inid-info-tint-primary">
              <h3 className="inid-info-info-card-title">
                <FiTarget />
                Exam Highlights
              </h3>
              {EXAM_HIGHLIGHTS.map((item) => (
                <div className="inid-info-highlight-item" key={item.title}>
                  <FiCheckCircle className="inid-info-highlight-icon" />
                  <div>
                    <p className="inid-info-highlight-title">{item.title}</p>
                    <p className="inid-info-highlight-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="inid-info-info-card inid-info-tint-secondary">
              <h3 className="inid-info-info-card-title">
                <FiHome />
                Participating Institutes
              </h3>
              {PARTICIPATING_INSTITUTES.map((inst) => (
                <div className="inid-info-dot-item" key={inst}>
                  <span className="inid-info-dot" />
                  {inst}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="inid-info-section inid-info-bg-light">
        <div className="inid-info-section-inner">
          <div className="inid-info-header-center">
            <span className="inid-info-eyebrow inid-info-reveal">
              <span className="inid-info-eyebrow-dot" />
              End To End Journey
            </span>
            <h2 className="inid-info-heading inid-info-reveal">
              INI-CET{" "}
              <span className="inid-info-heading-accent">Process Map</span>
            </h2>
            <p className="inid-info-para inid-info-reveal">
              Complete step-by-step journey from application to seat allocation.
            </p>
          </div>

          <div className="inid-info-process-grid inid-info-reveal">
            {PHASES.map((phase, pIdx) => (
              <div className="inid-info-process-col" key={phase.title}>
                <div className="inid-info-phase-card">
                  <div className={`inid-info-phase-band ${phase.band}`}>
                    <span className="inid-info-phase-roman">{phase.roman}</span>
                    <h3>{phase.title}</h3>
                  </div>
                  <div className="inid-info-phase-body">
                    {phase.steps.map((step, sIdx) => (
                      <React.Fragment key={step.title}>
                        <div className="inid-info-phase-step-mini">
                          <p className="inid-info-phase-step-title">
                            {step.title}
                          </p>
                          {step.desc && (
                            <p className="inid-info-phase-step-desc">
                              {step.desc}
                            </p>
                          )}
                        </div>
                        {sIdx < phase.steps.length - 1 && (
                          <span className="inid-info-phase-chevron">
                            <FiChevronDown />
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {pIdx < PHASES.length - 1 && (
                  <>
                    <span className="inid-info-process-arrow">
                      <FiChevronRight />
                    </span>
                    <div className="inid-info-process-arrow-mobile">
                      <span>
                        <FiChevronRight />
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="inid-info-section inid-info-bg-white">
        <div className="inid-info-section-inner">
          <div className="inid-info-header-center">
            <span className="inid-info-eyebrow inid-info-reveal">
              <span className="inid-info-eyebrow-dot" />
              Institute-wise Cutoff
            </span>
            <h2 className="inid-info-heading inid-info-reveal">
              INI-CET AIIMS{" "}
              <span className="inid-info-heading-accent">Cut Off</span>
            </h2>
            <p className="inid-info-para inid-info-reveal">
              Opening and closing ranks for AIIMS institutes.
            </p>
          </div>

          <div className="inid-info-table-wrap inid-info-scroll-wrap inid-info-reveal">
            <table className="inid-info-table">
              <thead>
                <tr>
                  <th>AIIMS Institute Name</th>
                  <th className="inid-info-th-center">Opening Rank</th>
                  <th className="inid-info-th-center">Closing Rank</th>
                </tr>
              </thead>
              <tbody>
                {AIIMS_CUTOFFS.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td className="inid-info-td-center">
                      <span className="inid-info-rank-badge">
                        {row.opening}
                      </span>
                    </td>
                    <td className="inid-info-td-center">
                      <span className="inid-info-rank-badge">
                        {row.closing}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="inid-info-note inid-info-note-secondary inid-info-reveal">
            <FiInfo />
            <span>
              <strong>Note:</strong> these cutoff ranks may vary year to year
              based on exam difficulty, number of candidates, and seat
              availability. Opening rank indicates the best rank that got
              admission, while closing rank shows the last rank that secured a
              seat.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InicetDashboardInfo;
