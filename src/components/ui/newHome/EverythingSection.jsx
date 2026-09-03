import { useRef } from "react";
import "./EverythingSection.css";

const features = [
  {
    number: "01",
    title: "College Predictor",
    description:
      "Estimate the colleges you can realistically expect based on your rank, category and previous counselling trends.",
  },
  {
    number: "02",
    title: "Rank Predictor",
    description:
      "Estimate your expected NEET PG rank using your exam performance.",
  },
  {
    number: "03",
    title: "AIQ Counselling",
    description:
      "Complete guidance for All India Quota counselling—from registration to admission.",
  },
  {
    number: "04",
    title: "State Counselling",
    description:
      "Stay updated with counselling schedules, eligibility criteria and state-specific rules.",
  },
  {
    number: "05",
    title: "Previous Year Closing Ranks",
    description:
      "Understand realistic admission possibilities using verified previous years' data.",
  },
  {
    number: "06",
    title: "College Comparison",
    description:
      "Compare colleges based on academics, fees, stipends, bond conditions and opportunities.",
  },
  {
    number: "07",
    title: "Fee Structure",
    description: "Know the complete fee details before making your choices.",
  },
  {
    number: "08",
    title: "Bond Information",
    description:
      "Understand service bonds, penalties and state obligations before locking your seat.",
  },
  {
    number: "09",
    title: "Stipend Details",
    description: "Compare stipends offered across institutions and states.",
  },
  {
    number: "10",
    title: "Expert Counselling",
    description:
      "Personalized guidance from experienced counselling experts who understand every counselling round.",
  },
];

const EverythingSection = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.offsetWidth * 0.75;

    carouselRef.current.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="questions-section">
        <div className="questions-container">
          <h2>
            WHAT'S GOING THROUGH
            <br />
            <span>YOUR MIND RIGHT NOW?</span>
          </h2>
          <div className="questions-content">
            <p className="questions-intro">
              You've finished your exam... <br /> Now the real questions begin.
            </p>
            <div className="questions-list">
              <p>Can I get MD Medicine?</p>
              <p>Can I get Radiology?</p>
              <p>Will I get a Government Medical College?</p>
              <p>Should I choose DNB?</p>
              <p>Should I wait for Round 2?</p>
              <p>Is it better to upgrade?</p>
              <p>Which college should I fill first?</p>
              <p>Which state gives me the best chance?</p>
              <p>How many colleges should I list?</p>
            </div>
            <p className="questions-ending">
              We've helped students answer these exact questions—with
              confidence, not guesswork.
            </p>
          </div>
          <div className="questions-image">
            <img
              src="https://cdn.dribbble.com/userupload/48907217/file/ab6a06e9e7679c7d4c665efa83f7098f.webp"
              alt="Medical counselling"
            />
          </div>
        </div>
      </div>

      <div className="everything-section">
        <div className="everything-container">
          <div className="everything-header">
            <h2>
              EVERYTHING YOU NEED.
              <br />
              <span>ALL IN ONE PLACE.</span>
            </h2>

            <div className="everything-carousel-controls">
              <button
                type="button"
                onClick={() => scroll("prev")}
                aria-label="Previous"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => scroll("next")}
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>

          <div className="everything-carousel" ref={carouselRef}>
            {features.map((feature) => (
              <article className="everything-card" key={feature.number}>
                <div className="everything-number">
                  <span>{feature.number}</span>
                  <span className="number-line"></span>
                </div>

                <div className="everything-card-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EverythingSection;
