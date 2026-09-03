import "./MentorSection.css";

const mentors = [
  {
    name: "Dr. Zainab Vora",
    image:
      "https://cdn.dribbble.com/userupload/47148402/file/210d605b7a0fe225a1cd8f1a658ca919.png",
  },
  {
    name: "Dr. Ravi Sharma",
    image:
      "https://cdn.dribbble.com/userupload/47148400/file/059d9e926eea42733d6020c1abea7cdd.png",
  },
  {
    name: "Dr. Apurv Mehra",
    image:
      "https://cdn.dribbble.com/userupload/47148401/file/1007fcbde4afe5e428766c261f30b946.png",
  },
];

const MentorSection = () => {
  return (
    <section className="mentor-section">
      <div className="mentor-container">
        <div className="mentor-intro">
          <h2>Career Decisions Need More Than Data.</h2>

          <p className="mentor-description">
            Rank predictors, cut-offs and college
            <br />
            information can tell you what is possible.
            <br />
            But they cannot always tell you:
          </p>

          <h3>What is right for YOU.</h3>
        </div>

        <div className="mentor-content">
          <div className="mentor-heading">
            <h2>Guidance & Mentorship From</h2>
          </div>

          <div className="mentor-grid">
            {mentors.map((mentor, index) => (
              <div className="mentor-card" key={mentor.name}>
                <div className="mentor-image-wrap">
                  <div className="mentor-gradient"></div>

                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="mentor-image"
                  />
                </div>

                <h4>{mentor.name}</h4>
              </div>
            ))}
          </div>

          <div className="mentor-bottom">
            <p>
              along with our experienced career
              <br />
              counselling team.
            </p>

            <div className="mentor-statements">
              <p>People who understand the journey.</p>
              <p>People who understand the choices.</p>
              <p>
                People who genuinely care about
                <br />
                getting them right.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorSection;
