import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./NeetpgCounsellingInfo.css";
import {
  FiCheckCircle,
  FiUpload,
  FiCreditCard,
  FiUser,
  FiList,
  FiHome,
  FiExternalLink,
  FiAlertCircle,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const RESULT_STEPS = [
  "Visit the official NBE website – https://nbe.edu.in/",
  "Click on NEET PG 2025 Results.",
  "Enter your NEET PG 2025 Application Number and Password.",
  "Click Submit.",
  "Your NEET PG 2025 scorecard will be displayed.",
  "Download and print your scorecard for counselling registration.",
];

const SPECIALTIES = [
  { specialty: "General Medicine", seats: "3,600+", demand: "Very High" },
  { specialty: "Radiology", seats: "1,200+", demand: "Very High" },
  { specialty: "Dermatology", seats: "700+", demand: "Very High" },
  { specialty: "Pediatrics", seats: "1,500+", demand: "High" },
  { specialty: "Obstetrics & Gynecology", seats: "1,400+", demand: "High" },
  { specialty: "Orthopedics", seats: "1,200+", demand: "High" },
  { specialty: "Anesthesiology", seats: "2,000+", demand: "High" },
  { specialty: "Psychiatry", seats: "900+", demand: "Rising" },
  { specialty: "Pathology", seats: "1,000+", demand: "Moderate" },
];

/* Single continuous journey: registration -> choice filling -> seat allotment.
   Grouped by phase, but rendered as one connected timeline since the
   steps genuinely happen in this order, one after another. */
const JOURNEY = [
  {
    phase: "Registration Phase",
    steps: [
      {
        title: "Register on MCC Portal",
        details: ["Create an account with your NEET PG credentials."],
        Icon: FiUser,
        marker: "primary",
      },
      {
        title: "Pay Registration Fee",
        details: ["₹5,000 for AIQ.", "₹2,000 for Deemed Universities."],
        Icon: FiCreditCard,
        marker: "primary",
      },
      {
        title: "Upload Documents",
        details: ["Upload all required certificates and documents."],
        Icon: FiUpload,
        marker: "primary",
      },
    ],
  },
  {
    phase: "Choice Filling & Seat Allotment",
    steps: [
      {
        title: "Fill Choices",
        details: [
          "Select colleges and specialties according to your preference.",
        ],
        Icon: FiList,
        marker: "secondary",
      },
      {
        title: "Seat Allotment",
        details: [
          "Seats are allotted by MCC based on rank and submitted choices.",
        ],
        Icon: FiCheckCircle,
        marker: "secondary",
      },
      {
        title: "Report to College",
        details: ["Complete admission formalities at the allotted college."],
        Icon: FiHome,
        marker: "cta",
      },
    ],
  },
];

/* demand → visual class (Very High / High / Rising / Moderate) */
const DEMAND_CLASS = {
  "Very High": "npgd-info-demand-veryhigh",
  High: "npgd-info-demand-high",
  Rising: "npgd-info-demand-rising",
  Moderate: "npgd-info-demand-moderate",
};

const MARKER_CLASS = {
  primary: "npgd-info-timeline-marker-primary",
  secondary: "npgd-info-timeline-marker-secondary",
  cta: "npgd-info-timeline-marker-cta",
};

/* Renders a step's text, turning a bare URL inside it into a real link
   without altering any of the surrounding wording. */
function StepText({ text }) {
  const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
  if (!urlMatch) return <>{text}</>;
  const url = urlMatch[0];
  const [before, after] = [
    text.slice(0, urlMatch.index),
    text.slice(urlMatch.index + url.length),
  ];
  return (
    <>
      {before}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="npgd-info-inline-link"
      >
        {url}
        <FiExternalLink />
      </a>
      {after}
    </>
  );
}

function NeetpgCounsellingInfo() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Every section header + body fades/slides up as it enters the viewport
      gsap.utils.toArray(".npgd-info-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".npgd-info-reveal"), {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
          },
        });
      });

      // Ticket steps stagger in
      gsap.from(".npgd-info-step", {
        opacity: 0,
        x: -14,
        duration: 0.45,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".npgd-info-ticket",
          start: "top 80%",
        },
      });

      // Table rows stagger in
      gsap.from(".npgd-info-table tbody tr", {
        opacity: 0,
        x: -16,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".npgd-info-table-wrap",
          start: "top 80%",
        },
      });

      // Timeline connector lines draw in + nodes pop as they scroll into view
      gsap.utils.toArray(".npgd-info-timeline-node").forEach((node) => {
        gsap.from(
          node.querySelectorAll(
            ".npgd-info-timeline-marker, .npgd-info-timeline-card",
          ),
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="npgd-info-root" ref={rootRef}>
      <section className="npgd-info-section npgd-info-bg-white">
        <div className="npgd-info-section-inner">
          <div className="npgd-info-header-center">
            <span className="npgd-info-eyebrow npgd-info-reveal">
              <span className="npgd-info-eyebrow-dot" />
              Results Declared
            </span>
            <h2 className="npgd-info-heading npgd-info-reveal">
              How to Check{" "}
              <span className="npgd-info-heading-accent">
                NEET PG 2025 Results?
              </span>
            </h2>
            <p className="npgd-info-para npgd-info-reveal">
              Follow these steps to check your NEET PG 2025 results and download
              your scorecard.
            </p>
          </div>

          <div className="npgd-info-ticket npgd-info-reveal">
            <ol className="npgd-info-steps">
              {RESULT_STEPS.map((step, i) => (
                <li className="npgd-info-step" key={i}>
                  <span className="npgd-info-step-num">{i + 1}</span>
                  <span className="npgd-info-step-text">
                    <StepText text={step} />
                  </span>
                </li>
              ))}
            </ol>
            <div className="npgd-info-ticket-foot">
              <FiAlertCircle />
              <span>
                <strong>Keep it safe:</strong> your scorecard is required again
                during MCC counselling registration.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="npgd-info-section npgd-info-bg-light">
        <div className="npgd-info-section-inner">
          <div className="npgd-info-header-center">
            {" "}
            <span className="npgd-info-eyebrow npgd-info-reveal">
              <span className="npgd-info-eyebrow-dot" />
              Choose Wisely
            </span>
            <h2 className="npgd-info-heading npgd-info-reveal">
              Popular{" "}
              <span className="npgd-info-heading-accent">
                NEET PG 2025 Specialties
              </span>
            </h2>
            <p className="npgd-info-para npgd-info-reveal">
              Top specialties with highest demand and career opportunities.
            </p>
          </div>

          <div className="npgd-info-table-wrap npgd-info-reveal">
            <table className="npgd-info-table">
              <thead>
                <tr>
                  <th>Specialty</th>
                  <th>Seats</th>
                  <th>Demand</th>
                </tr>
              </thead>
              <tbody>
                {SPECIALTIES.map((row) => (
                  <tr key={row.specialty}>
                    <td>{row.specialty}</td>
                    <td>
                      <span className="npgd-info-seat-count">{row.seats}</span>
                    </td>
                    <td>
                      <span
                        className={`npgd-info-demand-badge ${DEMAND_CLASS[row.demand] || ""}`}
                      >
                        {row.demand}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="npgd-info-section npgd-info-bg-white">
        <div className="npgd-info-section-inner">
          <div className="npgd-info-header-center">
            {" "}
            <span className="npgd-info-eyebrow npgd-info-reveal">
              <span className="npgd-info-eyebrow-dot" />
              Your Path to Admission
            </span>
            <h2 className="npgd-info-heading npgd-info-reveal">
              NEET PG 2025{" "}
              <span className="npgd-info-heading-accent">
                Counselling Process
              </span>
            </h2>
            <p className="npgd-info-para npgd-info-reveal">
              Complete step-by-step guide for NEET PG 2025 counselling
              registration.
            </p>
          </div>

          <div className="npgd-info-timeline npgd-info-reveal">
            {JOURNEY.map((block) => (
              <div className="npgd-info-phase-block" key={block.phase}>
                <h3 className="npgd-info-timeline-phase-label">
                  {block.phase}
                </h3>
                <div className="npgd-info-timeline-track">
                  {block.steps.map((step) => (
                    <div className="npgd-info-timeline-node" key={step.title}>
                      <span
                        className={`npgd-info-timeline-marker ${MARKER_CLASS[step.marker]}`}
                      >
                        <step.Icon />
                      </span>
                      <div className="npgd-info-timeline-card">
                        <h4 className="npgd-info-timeline-step-title">
                          {step.title}
                        </h4>
                        {step.details.map((d, i) => (
                          <p className="npgd-info-timeline-step-desc" key={i}>
                            {d}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default NeetpgCounsellingInfo;
