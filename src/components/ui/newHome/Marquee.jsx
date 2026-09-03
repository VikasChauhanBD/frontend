import React, { useEffect, useRef } from "react";
import "./Marquee.css";
import gsap from "gsap";

function Marquee() {
  const marqueeRef = useRef();

  useEffect(() => {
    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 15,
      repeat: -1,
      ease: "none",
    });

    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        tween.timeScale(1);

        gsap.to(".marquee-line img", {
          rotate: 180,
          duration: 0.3,
        });
      } else {
        tween.timeScale(-1);

        gsap.to(".marquee-line img", {
          rotate: 0,
          duration: 0.3,
        });
      }
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      tween.kill();
    };
  }, []);

  return (
    <section className="marquee-container">
      <h2>
        Trusted by thousands of <span>NEET PG aspirants</span>
      </h2>
      <div className="marquee-track" ref={marqueeRef}>
        {/* FIRST SET */}
        <div className="marquee-line">
          <h3>Expert Counselling</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        <div className="marquee-line">
          <h3>Previous Year Seat Matrix</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        <div className="marquee-line">
          <h3>AIQ & State Counselling Support</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        <div className="marquee-line">
          <h3>College Prediction</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        <div className="marquee-line">
          <h3>Choice Filling Assistance</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        {/* DUPLICATE SET */}

        <div className="marquee-line">
          <h3>Expert Counselling</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        <div className="marquee-line">
          <h3>Previous Year Seat Matrix</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        <div className="marquee-line">
          <h3>AIQ & State Counselling Support</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        <div className="marquee-line">
          <h3>College Prediction</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>

        <div className="marquee-line">
          <h3>Choice Filling Assistance</h3>
          <img
            src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

export default Marquee;
