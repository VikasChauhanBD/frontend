import React from "react";
import { CheckCircle2, Clock3, FileText, ExternalLink } from "lucide-react";
import "./NeetugUpdates.css";

const neetUGUpdates = [
  {
    id: 1,
    date: "February 7, 2025",
    event: "Registration Start",
    status: "completed",
  },
  {
    id: 2,
    date: "March 7, 2025",
    event: "Last Date for Registration",
    status: "completed",
  },
  {
    id: 3,
    date: "April 30, 2025",
    event: "Admit Card Release",
    status: "completed",
  },
  {
    id: 4,
    date: "May 4, 2025 (Sunday)",
    event: "NEET UG 2025 Exam",
    status: "completed",
  },
  {
    id: 5,
    date: "June 21, 2026 (Sunday)",
    event: "RE-NEET UG 2026 Exam",
    status: "completed",
  },
];

const pdfUrl =
  "https://believersconsultancy.com/data/AIQ_and_State_Schedule_PG_2025_dated_25.11.25.pdf";

function NeetugUpdates() {
  return (
    <section className="neetug-updates">
      <div className="neetug-updates-container">
        <div className="neetug-updates-header">
          <span className="neetug-updates-eyebrow">NEET UG Timeline</span>

          <h2 className="neetug-updates-title">
            NEET UG <span>Important Dates & Events</span>
          </h2>

          <p className="neetug-updates-description">
            View Full Counselling Schedule
          </p>
        </div>

        <div className="neetug-updates-timeline">
          <div className="neetug-updates-line"></div>

          {neetUGUpdates.map((item, index) => {
            const isCompleted = item.status === "completed";

            return (
              <div
                className={`neetug-update-item ${
                  isCompleted ? "is-highlight" : ""
                }`}
                key={item.id}
              >
                <div className="neetug-update-marker">
                  {isCompleted ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Clock3 size={20} />
                  )}
                </div>

                <div className="neetug-update-card">
                  <div className="neetug-update-top">
                    <span className="neetug-update-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`neetug-update-status ${
                        isCompleted ? "completed" : "upcoming"
                      }`}
                    >
                      {isCompleted ? "Completed" : "Upcoming"}
                    </span>
                  </div>

                  <div className="neetug-update-date">{item.date}</div>

                  <h3 className="neetug-update-event">{item.event}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* PDF Reference */}
        {/* 
        <div className="neetug-updates-reference">
          <div className="neetug-reference-icon">
            <FileText size={22} />
          </div>

          <div className="neetug-reference-content">
            <span className="neetug-reference-label">
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
            className="neetug-reference-btn"
          >
            View Schedule
            <ExternalLink size={17} />
          </a>
        </div>
        */}
      </div>
    </section>
  );
}

export default NeetugUpdates;
