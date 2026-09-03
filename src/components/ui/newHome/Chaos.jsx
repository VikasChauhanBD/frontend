import "./Chaos.css";

const chaosReasons = [
  {
    title: "UNDERSTAND",
    description:
      "Your Rank & Realistic Options\nPrevious-year closing ranks, cut-offs and realistic possibilities.",
    image:
      "https://cdn.dribbble.com/userupload/48540668/file/f33831be7837167cb7a7e72ee96da473.png",
  },
  {
    title: "EVALUATE",
    description:
      "Colleges & Branches\nCompare what each option actually means for your career.",
    image:
      "https://cdn.dribbble.com/userupload/48540669/file/1a2e4b1fda6acc8c412d4838d7065e2c.png",
  },
  {
    title: "PLAN",
    description:
      "Your Counselling Strategy\nAIQ, State counselling, quotas, upgrades and preference planning.",
    image:
      "https://cdn.dribbble.com/userupload/48540667/file/21ce21aa8cd786cd246b51be30a26c1d.png",
  },
  {
    title: "DECIDE",
    description:
      "With Confidence\nMove forward with clarity — not confusion or guesswork.",
    image:
      "https://cdn.dribbble.com/userupload/48540672/file/360b74d464973f28bbeda8a039f7c837.png",
  },
];

function Chaos() {
  return (
    <div className="chaos-wrapper">
      <div className="chaos-section">
        {/* -------------------- Section Heading -------------------- */}
        <div className="chaos-header">
          <h1 className="chaos-title">From Rank to the Right Decision.</h1>

          {/* <p className="chaos-subtitle">
            To get the best seat, here's everything you're expected to figure
            out on your own:
          </p> */}
        </div>

        <div className="chaos-video-visual">
          <video
            className="chaos-video"
            autoPlay
            loop
            muted
            poster=""
            role="none"
            aria-label="background gradient animation"
          >
            <source
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/bg-gradient-animation.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="chaos-section-wrapper">
          <div className="chaos-content-wrapper">
            {chaosReasons.map((reason, index) => (
              <div
                key={index}
                className={`chaos-content chaos-content-${index + 1}`}
              >
                <div className="chaos-mobile-visual">
                  <img
                    className="chaos-card-img"
                    src={reason.image}
                    alt={reason.title}
                  />

                  <div className="chaos-number-badge">{index + 1}</div>
                </div>

                <div className="chaos-meta">
                  <p className="chaos-challenge">
                    {String(index + 1).padStart(2, "0")} —
                  </p>

                  <h2 className="chaos-headline">
                    <span className="chaos-text-highlight">{reason.title}</span>
                  </h2>

                  <p className="chaos-desc">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="chaos-visual">
            <div className="chaos-card-wrapper">
              {chaosReasons.map((reason, index) => (
                <div
                  key={index}
                  className={`chaos-card chaos-card-${index + 1}`}
                >
                  <img
                    className="chaos-card-img"
                    src={reason.image}
                    alt={reason.title}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chaos;
