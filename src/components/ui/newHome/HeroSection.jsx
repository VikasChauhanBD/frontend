import { useEffect, useRef } from "react";
import "./HeroSection.css";

const HeroSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let blobs = [];
    let animationFrame;

    const COLORS = {
      navy: "#01092d",
      azure: "#032c7b",
      blue: "#0464de",
      orange: "#E85002",
      frost: "#aee37b",
    };

    const hexToRgb = (hex) => {
      hex = hex.replace("#", "");

      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    };

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const createBlobs = () => {
      blobs = [
        {
          color: COLORS.blue,
          x: width * 0.72,
          y: -height * 0.15,
          size: Math.max(width * 0.38, 420),
          speed: 0.32,
          amplitude: width * 0.1,
          frequency: 0.00055,
          phase: 0,
        },
        {
          color: COLORS.azure,
          x: width * 0.88,
          y: height * 0.05,
          size: Math.max(width * 0.34, 380),
          speed: 0.24,
          amplitude: width * 0.13,
          frequency: 0.00042,
          phase: 2,
        },
        {
          color: COLORS.orange,
          x: width * 0.76,
          y: height * 0.25,
          size: Math.max(width * 0.28, 300),
          speed: 0.28,
          amplitude: width * 0.12,
          frequency: 0.0005,
          phase: 4,
        },
        {
          color: COLORS.frost,
          x: width * 0.6,
          y: height * 0.46,
          size: Math.max(width * 0.22, 240),
          speed: 0.2,
          amplitude: width * 0.15,
          frequency: 0.00045,
          phase: 5,
        },
        {
          color: COLORS.blue,
          x: width * 0.82,
          y: height * 0.72,
          size: Math.max(width * 0.4, 430),
          speed: 0.26,
          amplitude: width * 0.12,
          frequency: 0.00048,
          phase: 7,
        },
        {
          color: COLORS.azure,
          x: width * 0.52,
          y: height * 0.95,
          size: Math.max(width * 0.35, 380),
          speed: 0.18,
          amplitude: width * 0.16,
          frequency: 0.00038,
          phase: 9,
        },
      ];
    };

    const drawBlob = (blob, time) => {
      const wave1 =
        Math.sin(time * blob.frequency + blob.phase) * blob.amplitude;

      const wave2 =
        Math.sin(time * 0.00025 + blob.phase) * blob.amplitude * 0.35;

      const x = blob.x + wave1 + wave2;
      const y = blob.y;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.size);

      const rgb = hexToRgb(blob.color);

      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.95)`);

      gradient.addColorStop(0.22, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)`);

      gradient.addColorStop(0.45, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.42)`);

      gradient.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`);

      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.arc(x, y, blob.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time) => {
      ctx.fillStyle = COLORS.navy;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      ctx.filter = "blur(75px)";
      ctx.globalCompositeOperation = "screen";

      blobs.forEach((blob) => {
        blob.y += blob.speed;

        if (blob.y > height + blob.size) {
          blob.y = -blob.size * 1.8;
          blob.x = width * (0.55 + Math.random() * 0.35);
        }

        drawBlob(blob, time);
      });

      ctx.restore();

      const atmosphere = ctx.createRadialGradient(
        width * 0.7,
        height * 0.35,
        0,
        width * 0.7,
        height * 0.35,
        width * 0.75,
      );

      atmosphere.addColorStop(0, "rgba(4, 100, 222, 0.08)");

      atmosphere.addColorStop(1, "rgba(1, 9, 45, 0)");

      ctx.fillStyle = atmosphere;
      ctx.fillRect(0, 0, width, height);

      animationFrame = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createBlobs();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createBlobs();
    });

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="liquid-canvas" />

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
    </section>
  );
};

export default HeroSection;
