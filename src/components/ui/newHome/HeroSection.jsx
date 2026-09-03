import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source
          src="https://cdn.dribbble.com/userupload/48906112/file/5b557c635909f4a5154d251429a861a9.mp4"
          // src="https://cdn.dribbble.com/userupload/48906113/file/bc4f018f6478b34278ebec425c8f724f.mp4"
          type="video/mp4"
        />
      </video>

      <div className="hero-overlay"></div>

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
    </section>
  );
};

export default HeroSection;
