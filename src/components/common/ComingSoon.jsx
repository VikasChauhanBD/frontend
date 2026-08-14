import React from "react";
import { FiClock, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ComingSoon.css";

function ComingSoon() {
  const navigate = useNavigate();

  return (
    <section className="coming-soon">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <FiClock />
        </div>

        <span className="coming-soon-badge">COMING SOON</span>

        <h1>
          Something <span>Great</span> Is Coming
        </h1>

        <p>
          We’re working on something exciting for you. This section will be
          available soon with new features and useful resources.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="coming-soon-btn"
        >
          <FiHome />
          Back to Home
        </button>
      </div>
    </section>
  );
}

export default ComingSoon;
