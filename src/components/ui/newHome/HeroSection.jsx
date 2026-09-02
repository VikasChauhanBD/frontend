import { useEffect, useRef } from "react";
import "./HeroSection.css";
import gsap from "gsap";

const HeroSection = () => {
  const heroRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blobs = gsap.utils.toArray(".bg-blob");

      blobs.forEach((blob, index) => {
        const xMovement = [80, -70, 90, -80, 70, -60][index] || 60;
        const yMovement = [50, 80, -60, 70, -50, 60][index] || 50;

        gsap.to(blob, {
          x: xMovement,
          y: yMovement,
          scale: 1.08,
          duration: 5 + index * 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3,
        });

        gsap.to(blob, {
          rotation: index % 2 === 0 ? 8 : -8,
          duration: 7 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5,
        });
      });

      const heroContent = gsap.utils.toArray(".hero-content > *");

      gsap.from(heroContent, {
        opacity: 0,
        y: 35,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });

      const marquee = marqueeRef.current;

      const marqueeTween = gsap.to(marquee, {
        xPercent: -50,
        duration: 18,
        repeat: -1,
        ease: "none",
      });

      let currentDirection = 1;

      const handleWheel = (event) => {
        const direction = event.deltaY > 0 ? 1 : -1;

        if (direction === currentDirection) {
          return;
        }

        currentDirection = direction;

        gsap.to(marqueeTween, {
          timeScale: direction,
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(".marquee-line img", {
          rotation: direction === 1 ? 180 : 0,
          duration: 0.3,
          overwrite: true,
          ease: "power2.out",
        });
      };

      window.addEventListener("wheel", handleWheel, {
        passive: true,
      });

      const buttons = gsap.utils.toArray(".primary-btn, .secondary-btn");

      buttons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            y: -4,
            duration: 0.25,
            ease: "power2.out",
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          });
        });
      });

      return () => {
        window.removeEventListener("wheel", handleWheel);
        marqueeTween.kill();
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-background">
        <div className="bg-blob blob-blue"></div>
        <div className="bg-blob blob-azure"></div>
        <div className="bg-blob blob-orange"></div>
        <div className="bg-blob blob-frost"></div>
        <div className="bg-blob blob-blue-bottom"></div>
        <div className="bg-blob blob-azure-bottom"></div>
      </div>

      <div className="soft-overlay"></div>

      <div className="grain"></div>

      <div className="hero-content">
        <h3>Your NEET PG Exam Is Over.</h3>

        <h1>Now Every Choice Matters.</h1>

        <h4>Your rank doesn't decide your future.</h4>

        <h3>Your counselling decisions do.</h3>

        <p>
          Choosing the right college is often more important than improving your
          rank by a few hundred places. Every counselling brings new
          opportunities—and one wrong decision can cost you the seat you've
          worked so hard for.
          <br />
          <br />
          At <strong>Believers Consultancy</strong>, we help NEET PG aspirants
          make informed, confident counselling decisions using real data,
          previous years' trends, and expert guidance.
        </p>

        <div className="hero-actions">
          <a href="#predict-college" className="primary-btn">
            Predict My College
          </a>

          <a href="#free-counselling" className="secondary-btn">
            Book Free Counselling
          </a>
        </div>
      </div>

      <div className="marquee-section">
        {/* <h4>Trusted by thousands of NEET PG aspirants</h4> */}

        <div className="marquee-wrapper">
          <div className="marquee-track" ref={marqueeRef}>
            {/* FIRST SET */}

            <div className="marquee-line">
              <h2>Expert Counselling</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            <div className="marquee-line">
              <h2>Previous Year Seat Matrix</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            <div className="marquee-line">
              <h2>AIQ & State Counselling Support</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            <div className="marquee-line">
              <h2>College Prediction</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            <div className="marquee-line">
              <h2>Choice Filling Assistance</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            {/* DUPLICATE SET */}

            <div className="marquee-line">
              <h2>Expert Counselling</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            <div className="marquee-line">
              <h2>Previous Year Seat Matrix</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            <div className="marquee-line">
              <h2>AIQ & State Counselling Support</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            <div className="marquee-line">
              <h2>College Prediction</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>

            <div className="marquee-line">
              <h2>Choice Filling Assistance</h2>
              <img
                src="https://www.brandium.nl/wp-content/uploads/2023/07/arrow-br.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
