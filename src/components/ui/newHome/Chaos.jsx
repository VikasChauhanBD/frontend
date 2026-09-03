import "./Chaos.css";

const chaosReasons = [
  {
    title: "Unpredictable Trends",
    description:
      "Last Year's Cutoffs Won't Save You. You need multi-year trends, current seat data, and insights on how others are choosing.",
    image:
      "https://cdn.dribbble.com/userupload/48540668/file/f33831be7837167cb7a7e72ee96da473.png",
  },
  {
    title: "The Rules Vary. A Lot.",
    description:
      "Every state/counselling/quota has its own rules, fees, and eligibility, and they change every round.",
    image:
      "https://cdn.dribbble.com/userupload/48540669/file/1a2e4b1fda6acc8c412d4838d7065e2c.png",
  },
  {
    title: "Decoding Quotas & Options",
    description:
      "All India Quota, State Quota, Deemed, Private, MBBS or BDS? Each path affects your fees, choices and future.",
    image:
      "https://cdn.dribbble.com/userupload/48540667/file/21ce21aa8cd786cd246b51be30a26c1d.png",
  },
  {
    title: "Which College? Which Seat?",
    description:
      "160,000+ seats. 1000+ colleges. You need to find the ones that fit your rank, budget, and goals.",
    image:
      "https://cdn.dribbble.com/userupload/48540672/file/360b74d464973f28bbeda8a039f7c837.png",
  },
  {
    title: "Myths, PDFs and WhatsApp Advice",
    description:
      "From Telegram tips to WhatsApp groups, everyone has unreliable opinions while official data is scattered and hard to decode.",
    image:
      "https://cdn.dribbble.com/userupload/48540670/file/f8e7ed488883abd3106b367111f56396.png",
  },
  {
    title: "Make Confident Choices",
    description:
      "A single mistake in your choice list can set you back. You're expected to make confident decisions on the 1st try.",
    image:
      "https://cdn.dribbble.com/userupload/48540671/file/b17cce4e11ed35ca39d1797ef7f89a22.png",
  },
];

function Chaos() {
  return (
    <div className="chaos-wrapper">
      <div className="chaos-section">
        {/* -------------------- Section Heading -------------------- */}
        <div className="chaos-header">
          <h1 className="chaos-title">From Rank to the Right Decision</h1>

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
                  <p className="chaos-challenge">Challenge #{index + 1}</p>

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
