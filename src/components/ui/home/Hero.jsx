import React from "react";
import { Typewriter } from "react-simple-typewriter";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">100% FREE Medical Counselling</span>

          <h1>
            Your Ultimate Guide to
            <span> Medical Counselling</span>
          </h1>

          <div className="hero-typewriter">
            <Typewriter
              words={[
                "NEET PG",
                "INICET",
                "NEET UG (Coming Soon)",
                "NEET SS (Coming Soon)",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={1800}
            />
          </div>

          <p>
            Counselling dates, colleges, cut-offs, fees, previous year data,
            seat matrix, documents, and everything required for hassle-free
            choice filling.
          </p>

          <h4>
            All resources are completely FREE - Just login and access
            everything.
          </h4>

          <div className="hero-buttons">
            <button onClick={() => navigate("/login")} className="primary-btn">
              Get Started &rarr;
            </button>
          </div>
        </div>
      </div>

      <div className="hero-blur hero-blur1"></div>
      <div className="hero-blur hero-blur2"></div>
    </section>
  );
}

export default Hero;
