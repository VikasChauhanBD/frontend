import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./NeetugDashboardInfo.css";
import {
  FiFileText,
  FiCalendar,
  FiExternalLink,
  FiUsers,
  FiAward,
  FiTarget,
  FiCheckCircle,
  FiHome,
  FiClock,
  FiInfo,
  FiBookOpen,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const RESULT_STEPS = [
  { title: "Visit NTA Portal", desc: "Go to https://neet.nta.nic.in/" },
  { title: "Click Result Link", desc: "Select 'NEET UG 2025 Result'" },
  {
    title: "Enter Credentials",
    desc: "Application No, Password & Security Pin",
  },
  {
    title: "View & Download",
    desc: "Submit to see result, download scorecard",
  },
  { title: "Save for Counselling", desc: "Note your AIR & Percentile" },
];

const COUNSELLING_STEPS = [
  {
    Icon: FiUsers,
    title: "Register on MCC",
    desc: "Use NEET credentials at mcc.nic.in",
  },
  {
    Icon: FiAward,
    title: "Pay Security Deposit",
    desc: "₹10,000 for Govt / ₹2L for Deemed",
  },
  {
    Icon: FiTarget,
    title: "Fill & Lock Choices",
    desc: "Select colleges in preference order",
  },
  {
    Icon: FiCheckCircle,
    title: "Seat Allotment",
    desc: "Based on rank, choices & availability",
  },
  {
    Icon: FiHome,
    title: "Report to College",
    desc: "Complete admission formalities",
  },
];

const COURSE_YEARS = ["2025", "2024", "2023", "2022"];

const COURSE_TRENDS = [
  { course: "MBBS (Govt)", years: [92, 94, 91, 89] },
  { course: "MBBS (Private)", years: [5, 4, 6, 7], highlight: true },
  { course: "BDS (Govt)", years: [2, 1, 2, 3], highlight: true },
  { course: "AYUSH Courses", years: [1, 1, 1, 1] },
];

const TREND_INSIGHTS = [
  {
    title: "MBBS Dominance",
    accent: "primary",
    text: "92%+ of top 100 rankers choose Government MBBS — the most preferred course.",
  },
  {
    title: "Stable Trends",
    accent: "secondary",
    text: "MBBS preference remains consistently above 90% among top rankers across all years.",
  },
  {
    title: "Key Insight",
    accent: "cta",
    text: "Top rankers prioritize Government MBBS due to low fees, quality education & better PG prospects.",
  },
];

const CUTOFF_SCORES = [
  { cat: "General / EWS", pct: "50th percentile", range: "164–180 marks" },
  { cat: "OBC / SC / ST", pct: "40th percentile", range: "129–164 marks" },
  { cat: "General-PwD", pct: "45th percentile", range: "146–164 marks" },
  { cat: "OBC/SC/ST-PwD", pct: "40th percentile", range: "129–146 marks" },
];

const MARKS_VS_RANK = [
  { score: "705–720", rank: "1–50", prospect: "Top AIIMS, MAMC, UCMS, KGMU" },
  {
    score: "690–704",
    rank: "51–200",
    prospect: "Top Govt Colleges (Clinical branches)",
  },
  {
    score: "670–689",
    rank: "201–600",
    prospect: "Excellent Govt Medical Colleges",
  },
  { score: "650–669", rank: "601–1,500", prospect: "Very Good Govt Colleges" },
  {
    score: "630–649",
    rank: "1,501–3,500",
    prospect: "Good Govt + Top Private",
  },
  {
    score: "610–629",
    rank: "3,501–7,000",
    prospect: "Govt (Paraclinical) + Good Private",
  },
  {
    score: "590–609",
    rank: "7,001–12,000",
    prospect: "Private Colleges (Clinical possible)",
  },
  {
    score: "560–589",
    rank: "12,001–25,000",
    prospect: "Private / Deemed Universities",
  },
  {
    score: "520–559",
    rank: "25,001–50,000",
    prospect: "Private (Management quota likely)",
  },
  {
    score: "450–519",
    rank: "50,001–1,00,000",
    prospect: "Limited Private Options",
  },
  {
    score: "350–449",
    rank: "1,00,001–3,00,000",
    prospect: "BDS / AYUSH / Very Limited MBBS",
  },
  {
    score: "<350",
    rank: "3,00,000+",
    prospect: "Qualifying only — Reattempt advised",
  },
];

const POPULAR_COURSES = [
  { name: "MBBS", seats: "1,09,000+", demand: "Very High" },
  { name: "BDS", seats: "27,000+", demand: "High" },
  { name: "BAMS", seats: "30,000+", demand: "Rising" },
  { name: "BHMS", seats: "12,000+", demand: "Moderate" },
  { name: "BUMS", seats: "2,500+", demand: "Moderate" },
  { name: "BSMS", seats: "600+", demand: "Niche" },
  { name: "BVSc & AH", seats: "3,200+", demand: "Specialized" },
  { name: "B.Sc Nursing", seats: "25,000+", demand: "High" },
  { name: "AYUSH Integrated", seats: "5,000+", demand: "Emerging" },
];

const DEMAND_META = {
  "Very High": {
    badge: "nugd-info-demand-veryhigh",
    bar: "nugd-info-accent-cta",
    width: "95%",
  },
  High: { badge: "nugd-info-demand-high", bar: "", width: "75%" },
  Rising: {
    badge: "nugd-info-demand-rising",
    bar: "nugd-info-accent-secondary",
    width: "55%",
  },
  Moderate: {
    badge: "nugd-info-demand-neutral",
    bar: "nugd-info-accent-neutral",
    width: "35%",
  },
  Niche: {
    badge: "nugd-info-demand-neutral",
    bar: "nugd-info-accent-neutral",
    width: "35%",
  },
  Specialized: {
    badge: "nugd-info-demand-neutral",
    bar: "nugd-info-accent-neutral",
    width: "35%",
  },
  Emerging: {
    badge: "nugd-info-demand-neutral",
    bar: "nugd-info-accent-neutral",
    width: "35%",
  },
};

function NeetugDashboardInfo() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".nugd-info-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".nugd-info-reveal"), {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 82%" },
        });
      });

      gsap.utils.toArray(".nugd-info-table-wrap").forEach((wrap) => {
        gsap.from(wrap.querySelectorAll("tbody tr"), {
          opacity: 0,
          x: -16,
          duration: 0.45,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: { trigger: wrap, start: "top 80%" },
        });
      });

      gsap.from(".nugd-info-course-card", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: ".nugd-info-course-grid", start: "top 85%" },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="nugd-info-root" ref={rootRef}>
      <section className="nugd-info-section nugd-info-bg-light">
        <div className="nugd-info-section-inner">
          <div className="nugd-info-guide-grid">
            <div className="nugd-info-guide-card nugd-info-reveal">
              <div className="nugd-info-guide-band nugd-info-guide-band-primary">
                <span className="nugd-info-guide-icon">
                  <FiFileText />
                </span>
                <div>
                  <h3>How to Check NEET UG 2025 Results</h3>
                  <p>Step-by-step guide from NTA</p>
                </div>
              </div>
              <div className="nugd-info-guide-body">
                <div className="nugd-info-guide-steps">
                  {RESULT_STEPS.map((step, i) => (
                    <div className="nugd-info-guide-step" key={step.title}>
                      <span className="nugd-info-guide-step-num">{i + 1}</span>
                      <div>
                        <p className="nugd-info-guide-step-title">
                          {step.title}
                        </p>
                        <p className="nugd-info-guide-step-desc">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href="https://neet.nta.nic.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nugd-info-guide-cta"
                >
                  <FiExternalLink />
                  Open NTA Portal
                </a>
              </div>
            </div>

            <div className="nugd-info-guide-card nugd-info-reveal">
              <div className="nugd-info-guide-band nugd-info-guide-band-secondary">
                <span className="nugd-info-guide-icon">
                  <FiCalendar />
                </span>
                <div>
                  <h3>NEET UG 2026 Counselling Guide</h3>
                  <p>AIQ & State Quota process explained</p>
                </div>
              </div>
              <div className="nugd-info-guide-body">
                <div className="nugd-info-tabs">
                  <span className="nugd-info-tab nugd-info-tab-active">
                    15% AIQ (MCC)
                  </span>
                  <span className="nugd-info-tab">85% State Quota</span>
                </div>

                <div className="nugd-info-guide-steps">
                  {COUNSELLING_STEPS.map((step) => (
                    <div className="nugd-info-icon-step" key={step.title}>
                      <span className="nugd-info-icon-step-chip">
                        <step.Icon />
                      </span>
                      <div>
                        <p className="nugd-info-guide-step-title">
                          {step.title}
                        </p>
                        <p className="nugd-info-guide-step-desc">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="nugd-info-tip-box">
                  <FiClock />
                  <p>
                    <strong>Pro Tip:</strong> Start counselling registration
                    immediately after result declaration. Early registration
                    ensures better choice availability in Round 1.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nugd-info-section nugd-info-bg-white">
        <div className="nugd-info-section-inner">
          <div className="nugd-info-header-center">
            <span className="nugd-info-eyebrow nugd-info-reveal">
              <span className="nugd-info-eyebrow-dot" />
              Top Ranker Choices
            </span>
            <h2 className="nugd-info-heading nugd-info-reveal">
              Trend: Top 100 Ranks —{" "}
              <span className="nugd-info-heading-accent">
                Course Preferences
              </span>
            </h2>
            <p className="nugd-info-para nugd-info-reveal">
              Course choices by first 100 rank holders in All India Quota
              Counselling, 2021–2025.
            </p>
          </div>

          <div className="nugd-info-table-wrap nugd-info-reveal">
            <table className="nugd-info-table">
              <thead>
                <tr>
                  <th>Course</th>
                  {COURSE_YEARS.map((y) => (
                    <th className="nugd-info-th-center" key={y}>
                      {y}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COURSE_TRENDS.map((row) => (
                  <tr key={row.course}>
                    <td>{row.course}</td>
                    {row.years.map((value, i) => (
                      <td
                        key={i}
                        className={`nugd-info-td-center nugd-info-cell-num ${
                          row.highlight ? "nugd-info-cell-highlight" : ""
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="nugd-info-insight-grid nugd-info-reveal">
            {TREND_INSIGHTS.map((card) => (
              <div
                className={`nugd-info-insight-card ${
                  card.accent === "secondary"
                    ? "nugd-info-accent-secondary"
                    : card.accent === "cta"
                      ? "nugd-info-accent-cta"
                      : ""
                }`}
                key={card.title}
              >
                <h4 className="nugd-info-insight-title">{card.title}</h4>
                <p className="nugd-info-insight-text">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nugd-info-section nugd-info-bg-light">
        <div className="nugd-info-section-inner">
          <div className="nugd-info-header-center">
            <span className="nugd-info-eyebrow nugd-info-reveal">
              <span className="nugd-info-eyebrow-dot" />
              Eligibility
            </span>
            <h2 className="nugd-info-heading nugd-info-reveal">
              NEET UG 2025{" "}
              <span className="nugd-info-heading-accent">
                Qualifying Cutoff
              </span>
            </h2>
            <p className="nugd-info-para nugd-info-reveal">
              Cutoffs are based on percentile — they vary by exam difficulty and
              normalization.
            </p>
          </div>

          <div className="nugd-info-table-wrap nugd-info-reveal">
            <table className="nugd-info-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="nugd-info-th-center">Percentile</th>
                  <th className="nugd-info-th-center">Expected Score (720)</th>
                </tr>
              </thead>
              <tbody>
                {CUTOFF_SCORES.map((row) => (
                  <tr key={row.cat}>
                    <td>{row.cat}</td>
                    <td className="nugd-info-td-center">{row.pct}</td>
                    <td className="nugd-info-td-center nugd-info-cell-num">
                      {row.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="nugd-info-note nugd-info-reveal">
            <FiInfo />
            <span>
              Qualifying cutoff ≠ admission cutoff. College cutoffs are much
              higher based on competition.
            </span>
          </div>
        </div>
      </section>

      <section className="nugd-info-section nugd-info-bg-white">
        <div className="nugd-info-section-inner">
          <div className="nugd-info-header-center">
            <span className="nugd-info-eyebrow nugd-info-reveal">
              <span className="nugd-info-eyebrow-dot" />
              Know Your Chances
            </span>
            <h2 className="nugd-info-heading nugd-info-reveal">
              NEET UG 2025: Marks vs Rank vs{" "}
              <span className="nugd-info-heading-accent">
                College Prospects
              </span>
            </h2>
            <p className="nugd-info-para nugd-info-reveal">
              Estimated All India Rank & admission chances based on your score.
            </p>
          </div>

          <div className="nugd-info-table-wrap nugd-info-scroll-wrap nugd-info-reveal">
            <table className="nugd-info-table">
              <thead>
                <tr>
                  <th className="nugd-info-th-center">Score Range</th>
                  <th className="nugd-info-th-center">Est. AIR</th>
                  <th>Admission Prospects</th>
                </tr>
              </thead>
              <tbody>
                {MARKS_VS_RANK.map((row, idx) => (
                  <tr key={idx}>
                    <td className="nugd-info-td-center nugd-info-cell-num">
                      {row.score}
                    </td>
                    <td className="nugd-info-td-center nugd-info-cell-num">
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

      <section className="nugd-info-section nugd-info-bg-light">
        <div className="nugd-info-section-inner">
          <div className="nugd-info-header-center">
            <h2 className="nugd-info-heading nugd-info-reveal">
              Popular{" "}
              <span className="nugd-info-heading-accent">
                NEET UG 2025 Courses
              </span>
            </h2>
            <p>Top courses with seat availability & demand analysis.</p>
          </div>

          <div className="nugd-info-course-grid nugd-info-reveal">
            {POPULAR_COURSES.map((course) => {
              const meta = DEMAND_META[course.demand];
              return (
                <div className="nugd-info-course-card" key={course.name}>
                  <div className="nugd-info-course-top">
                    <span className="nugd-info-course-icon">
                      <FiBookOpen />
                    </span>
                    <div>
                      <h4 className="nugd-info-course-name">{course.name}</h4>
                      <p className="nugd-info-course-seats">
                        {course.seats} seats
                      </p>
                    </div>
                  </div>
                  <span className={`nugd-info-demand-badge ${meta.badge}`}>
                    {course.demand} Demand
                  </span>
                  <div className="nugd-info-course-bar-track">
                    <div
                      className={`nugd-info-course-bar-fill ${meta.bar}`}
                      style={{ width: meta.width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default NeetugDashboardInfo;
