import { Check, X, ArrowRight, ShieldCheck } from "lucide-react";
import "./WhyBelievers.css";

const WhyBelievers = () => {
  const withoutGuidance = [
    "Random college choices",
    "Confusing counselling rules",
    "Missing better options",
    "Wrong order of preferences",
    "Last-minute panic",
    "Depending on social media opinions",
  ];

  const withBelievers = [
    "Data-driven college prediction",
    "Personalized counselling strategy",
    "Smart choice filling",
    "Better upgrade planning",
    "Round-wise guidance",
    "Confident decision-making",
  ];

  return (
    <section className="why-believers-section">
      <div className="why-believers-container">
        <div className="why-believers-header">
          <h2>
            WHY BELIEVERS
            <br />
            <span>CONSULTANCY?</span>
          </h2>
        </div>

        <div className="comparison-wrapper">
          <div className="comparison-card without-guidance">
            <div className="card-glow"></div>

            <div className="comparison-card-inner">
              <div className="comparison-title">
                <div className="title-icon">
                  <X size={25} strokeWidth={2.5} />
                </div>

                <h3>Without Expert Guidance</h3>
              </div>

              <div className="comparison-list">
                {withoutGuidance.map((item, index) => (
                  <div className="comparison-item" key={index}>
                    <div className="item-icon">
                      <X size={16} strokeWidth={3} />
                    </div>

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="comparison-card with-believers">
            <div className="blue-glow"></div>
            <div className="orange-glow"></div>

            <div className="comparison-card-inner">
              <div className="comparison-title">
                <div className="title-icon">
                  <ShieldCheck size={26} strokeWidth={2.2} />
                </div>

                <h3>With Believers Consultancy</h3>
              </div>

              <div className="comparison-list">
                {withBelievers.map((item, index) => (
                  <div className="comparison-item" key={index}>
                    <div className="item-icon">
                      <Check size={17} strokeWidth={3} />
                    </div>

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBelievers;
