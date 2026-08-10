import React from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ExternalLink,
} from "lucide-react";
import "./NeetpgUpdates.css";

const neetPGUpdates = [
  {
    id: 1,
    date: "July 1, 2026",
    event: "Registration / Application Form",
    isHighlight: true,
  },
  {
    id: 2,
    date: "July 21, 2026",
    event: "Last Date for Registration",
    isHighlight: true,
  },
  {
    id: 3,
    date: "July 31 - August 10, 2026",
    event: "Correction Window",
    isHighlight: true,
  },
  {
    id: 4,
    date: "August 27, 2026",
    event: "Admit Card Release",
    status: "upcoming",
  },
  {
    id: 5,
    date: "August 30, 2026",
    event: "NEET PG 2026 Exam",
    status: "upcoming",
  },
  {
    id: 6,
    date: "September 30, 2026",
    event: "Result Declaration",
    status: "upcoming",
  },
  {
    id: 7,
    date: "September-October 2026 (Tentative)",
    event: "Round 1 Counselling",
    status: "upcoming",
  },
  {
    id: 8,
    date: "October-November 2026 (Tentative)",
    event: "Round 2 Counselling",
    status: "upcoming",
  },
  {
    id: 9,
    date: "November-December 2026 (Tentative)",
    event: "Round 3 & Stray Vacancy Round",
    status: "upcoming",
  },
];

const pdfUrl =
  "https://believersconsultancy.com/data/AIQ_and_State_Schedule_PG_2025_dated_25.11.25.pdf";

function NeetpgUpdates() {
  return (
    <section className="neetpg-updates">
      <div className="neetpg-updates-container">
        {/* Header */}
        <div className="neetpg-updates-header">
          <span className="neetpg-updates-eyebrow">
            <CalendarDays size={16} />
            NEET PG 2026 Timeline
          </span>

          <h2 className="neetpg-updates-title">
            Important <span>NEET PG Dates & Updates</span>
          </h2>

          <p className="neetpg-updates-description">
            Keep track of the key NEET PG 2026 milestones, from registration and
            examination to results and counselling rounds.
          </p>
        </div>

        {/* Timeline */}
        <div className="neetpg-updates-timeline">
          <div className="neetpg-updates-line"></div>

          {neetPGUpdates.map((item, index) => (
            <div
              className={`neetpg-update-item ${
                item.isHighlight ? "is-highlight" : ""
              }`}
              key={item.id}
            >
              {/* Timeline Icon */}
              <div className="neetpg-update-marker">
                {item.isHighlight ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Clock3 size={20} />
                )}
              </div>

              {/* Content */}
              <div className="neetpg-update-card">
                <div className="neetpg-update-top">
                  <span className="neetpg-update-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`neetpg-update-status ${
                      item.isHighlight ? "completed" : "upcoming"
                    }`}
                  >
                    {item.isHighlight ? "Completed" : "Upcoming"}
                  </span>
                </div>

                <div className="neetpg-update-date">{item.date}</div>

                <h3 className="neetpg-update-event">{item.event}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* PDF Reference */}
        <div className="neetpg-updates-reference">
          <div className="neetpg-reference-icon">
            <FileText size={22} />
          </div>

          <div className="neetpg-reference-content">
            <span className="neetpg-reference-label">
              Official Schedule Reference
            </span>

            <h3>AIQ & State Counselling Schedule</h3>

            <p>
              Refer to the official schedule document for detailed counselling
              dates and state-wise updates.
            </p>
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neetpg-reference-btn"
          >
            View Schedule
            <ExternalLink size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default NeetpgUpdates;
