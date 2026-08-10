import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./NeetpgDataInsights.css";
import {
  FiTrendingUp,
  FiActivity,
  FiTarget,
  FiPercent,
  FiInfo,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- Data ---------------- */

const BRANCH_YEARS = ["2025", "2024", "2022", "2021"];

const BRANCH_TRENDS = [
  { branch: "Radiology", years: [38, 40, 39, 36] },
  { branch: "Medicine", years: [34, 32, 35, 33] },
  { branch: "Dermatology", years: [8, 7, 6, 7] },
  { branch: "Pediatrics", years: [6, 5, 5, 4] },
  { branch: "ObGy", years: [5, 6, 4, 5] },
  { branch: "Surgery", years: [5, 5, 6, 8] },
  { branch: "Orthopedics", years: [4, 3, 3, 4] },
];

const BRANCH_INSIGHTS = [
  {
    title: "Most Preferred",
    Icon: FiTrendingUp,
    accent: "primary",
    text: "Radiology and General Medicine dominate the Top 100 ranks consistently.",
  },
  {
    title: "Stable Trends",
    Icon: FiActivity,
    accent: "secondary",
    text: "Radiology and Medicine remain the most stable and highest-chosen branches across all years.",
  },
  {
    title: "Key Insight",
    Icon: FiTarget,
    accent: "cta",
    text: "Top rankers increasingly prefer lifestyle-friendly, high-ROI branches like Radiology and Dermatology over traditionally demanding surgical fields.",
  },
];

const MARKS_VS_RANK = [
  {
    score: "720–705",
    rank: "1–10",
    prospect: "Top AIIMS (Delhi/Jodhpur/Bhopal), PGI Chandigarh",
  },
  {
    score: "704–690",
    rank: "11–50",
    prospect: "Top AIIMS + Elite Govt Colleges",
  },
  {
    score: "689–670",
    rank: "51–200",
    prospect: "Top Govt Medical Colleges (Clinical branches possible)",
  },
  { score: "669–650", rank: "201–500", prospect: "Excellent Govt Colleges" },
  {
    score: "649–630",
    rank: "501–1,200",
    prospect: "Very Good Govt Colleges (Paraclinical/Some Clinical)",
  },
  {
    score: "629–610",
    rank: "1,201–2,500",
    prospect: "Good Govt + Deemed Universities",
  },
  {
    score: "609–590",
    rank: "2,501–5,000",
    prospect: "Govt Colleges (Non-clinical) + Good Private",
  },
  {
    score: "589–570",
    rank: "5,001–8,000",
    prospect: "Private + Some Govt (Low branches)",
  },
  {
    score: "569–550",
    rank: "8,001–12,000",
    prospect: "Private Colleges (Decent options)",
  },
  {
    score: "549–520",
    rank: "12,001–20,000",
    prospect: "Private / Deemed (Clinical difficult)",
  },
  {
    score: "519–480",
    rank: "20,001–35,000",
    prospect: "Private Colleges (Management quota likely)",
  },
  {
    score: "479–430",
    rank: "35,001–60,000",
    prospect: "Limited options (Mostly Private)",
  },
  {
    score: "429–380",
    rank: "60,001–90,000",
    prospect: "Very Limited (High fees / low demand branches)",
  },
  {
    score: "379–330",
    rank: "90,001–1,20,000",
    prospect: "Extremely Difficult",
  },
  { score: "<330", rank: "1,20,000+", prospect: "Very Low Chances" },
];

const CUTOFF_SCORES = [
  {
    cat: "Unreserved (UR) / EWS",
    pct: "50th percentile",
    range: "280–340 marks",
  },
  { cat: "SC / ST / OBC", pct: "40th percentile", range: "240–290 marks" },
  { cat: "UR-PwD", pct: "45th percentile", range: "260–310 marks" },
  { cat: "SC/ST/OBC-PwD", pct: "40th percentile", range: "240–290 marks" },
];

const ACCENT_CLASS = {
  primary: "",
  secondary: "npgd-insights-accent-secondary",
  cta: "npgd-insights-accent-cta",
};

function NeetpgDataInsights() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".npgd-insights-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".npgd-insights-reveal"), {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 82%" },
        });
      });

      gsap.utils.toArray(".npgd-insights-table-wrap").forEach((wrap) => {
        gsap.from(wrap.querySelectorAll("tbody tr"), {
          opacity: 0,
          x: -16,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: wrap, start: "top 80%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="npgd-insights-root" ref={rootRef}>
      <section className="npgd-insights-section npgd-insights-bg-light">
        <div className="npgd-insights-section-inner">
          <div className="npgd-insights-header-center">
            <span className="npgd-insights-eyebrow npgd-insights-reveal">
              <span className="npgd-insights-eyebrow-dot" />
              Choose Wisely
            </span>
            <h2 className="npgd-insights-heading npgd-insights-reveal">
              Trend Comparison:{" "}
              <span className="npgd-insights-heading-accent">
                Top 100 Rank{" "}
              </span>
              Branch Preferences
            </h2>
            <p className="npgd-insights-para npgd-insights-reveal">
              Branch preferences of the first 100 rank holders in All India
              Counselling, 2021–2025.
            </p>
          </div>

          <div className="npgd-insights-table-wrap npgd-insights-reveal">
            <table className="npgd-insights-table">
              <thead>
                <tr>
                  <th>Branch / Specialty</th>
                  {BRANCH_YEARS.map((y) => (
                    <th className="npgd-insights-th-center" key={y}>
                      {y}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BRANCH_TRENDS.map((row) => (
                  <tr key={row.branch}>
                    <td>{row.branch}</td>

                    {row.years.map((value, i) => (
                      <td
                        key={i}
                        className="npgd-insights-td-center npgd-insights-cell-num"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="npgd-insights-insight-grid npgd-insights-reveal">
            {BRANCH_INSIGHTS.map((card) => (
              <div
                className={`npgd-insights-insight-card ${ACCENT_CLASS[card.accent]}`}
                key={card.title}
              >
                <div className="npgd-insights-insight-head">
                  <span className="npgd-insights-insight-icon">
                    <card.Icon />
                  </span>
                  <h4 className="npgd-insights-insight-title">{card.title}</h4>
                </div>
                <p className="npgd-insights-insight-text">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="npgd-insights-section npgd-insights-bg-white">
        <div className="npgd-insights-section-inner">
          <div className="npgd-insights-header-center">
            <span className="npgd-insights-eyebrow npgd-insights-reveal">
              <span className="npgd-insights-eyebrow-dot" />
              Know Your Chances
            </span>
            <h2 className="npgd-insights-heading npgd-insights-reveal">
              NEET PG 2025{" "}
              <span className="npgd-insights-heading-accent">
                Marks vs Rank
              </span>{" "}
              Analysis
            </h2>
            <p className="npgd-insights-para npgd-insights-reveal">
              Here's how your marks may correspond to your All India Rank and
              admission prospects.
            </p>
          </div>

          <div className="npgd-insights-table-wrap npgd-insights-scroll-wrap npgd-insights-reveal">
            <table className="npgd-insights-table">
              <thead>
                <tr>
                  <th className="npgd-insights-th-center">Score Range</th>
                  <th className="npgd-insights-th-center">All India Rank</th>
                  <th>Admission Prospects</th>
                </tr>
              </thead>
              <tbody>
                {MARKS_VS_RANK.map((row, idx) => (
                  <tr key={idx}>
                    <td className="npgd-insights-td-center npgd-insights-cell-num">
                      {row.score}
                    </td>
                    <td className="npgd-insights-td-center npgd-insights-cell-num">
                      {row.rank}
                    </td>
                    <td>{row.prospect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="npgd-insights-section npgd-insights-bg-light">
        <div className="npgd-insights-section-inner">
          <div className="npgd-insights-header-center">
            <span className="npgd-insights-eyebrow npgd-insights-reveal">
              <span className="npgd-insights-eyebrow-dot" />
              Eligibility
            </span>
            <h2 className="npgd-insights-heading npgd-insights-reveal">
              NEET PG 2025{" "}
              <span className="npgd-insights-heading-accent">
                Cutoff Scores
              </span>
            </h2>
            <p className="npgd-insights-para npgd-insights-reveal">
              Cutoffs are based on percentile and vary each year depending on
              exam difficulty and normalization.
            </p>
          </div>

          <div className="npgd-insights-table-wrap npgd-insights-reveal">
            <table className="npgd-insights-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="npgd-insights-th-center">
                    <FiPercent
                      style={{ marginRight: 6, verticalAlign: "-2px" }}
                    />
                    Qualifying Percentile
                  </th>
                  <th className="npgd-insights-th-center">
                    Expected Score Range (2025)
                  </th>
                </tr>
              </thead>
              <tbody>
                {CUTOFF_SCORES.map((row) => (
                  <tr key={row.cat}>
                    <td>{row.cat}</td>
                    <td className="npgd-insights-td-center">{row.pct}</td>
                    <td className="npgd-insights-td-center npgd-insights-cell-num">
                      {row.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="npgd-insights-note npgd-insights-reveal">
            <FiInfo />
            <span>
              Cutoff marks change every year. Always rely on percentile rather
              than marks for eligibility.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NeetpgDataInsights;
