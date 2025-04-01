import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Main Container */}
      <div className="main-wrapper">
        {/* Abstract Background Shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.6, scale: 1, rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="abstract-shape shape-one"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.4, scale: 1, rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
            delay: 0.5,
          }}
          className="abstract-shape shape-two"
        ></motion.div>

        {/* Header / Navigation */}
        <header className="header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="logo"
          >
            PassivePips
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="nav-links"
          >
            <a href="#how">How It Works</a>
            <a href="#risk">Risk</a>
            <a href="#signup">Get Started</a>
          </motion.nav>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            Earn Consistent Forex Returns
            <br />
            With Zero Hidden Fees
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            Achieve average monthly gains of 2-5% through our automated PAMM
            solution.
            <br />
            No direct charges – just pure performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-cta"
          >
            <button className="btn gradient-pink">Get Started</button>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="section-wrapper">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            How It Works
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-grid"
          >
            {[
              {
                title: "1. Sign Up",
                text: "Create your account with our partnered broker. No setup fee or hidden costs.",
              },
              {
                title: "2. Connect to PAMM",
                text: "Follow a quick guide to link your account to our automated trading strategy.",
              },
              {
                title: "3. Enjoy the Gains",
                text: "Our algorithm trades for you, targeting 2-5% monthly returns. Withdraw anytime.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <h3 className="card-title">{item.title}</h3>
                <p className="card-text">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Risk / Transparency Section */}
        <section id="risk" className="section-wrapper">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Risk & Transparency
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="risk-text"
          >
            <p>
              Trading Forex involves risk. We employ a 40% stop-loss mechanism
              to prevent substantial losses. No strategy is guaranteed. Only
              invest what you can afford to lose.
            </p>
            <p>
              We earn through an affiliate agreement with the broker, so you pay
              nothing directly. You keep your profits.
            </p>
          </motion.div>
        </section>

        {/* Signup CTA */}
        <section id="signup" className="section-wrapper">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Ready to Start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="cta-subtext"
          >
            Sign up with our broker link and join our PAMM strategy in less than
            10 minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button className="btn gradient-green">Open a Free Account</button>
          </motion.div>
        </section>

        <footer className="footer">
          &copy; {new Date().getFullYear()} PassivePips. All rights reserved.
        </footer>
      </div>

      {/* Inline CSS Styles */}
      <style>{`
        /* GENERAL RESETS */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          margin: 0;
          font-family: sans-serif;
          background: #0A071D;
        }

        /* MAIN WRAPPER */
        .main-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          color: #fff;
          overflow: hidden;
          background: linear-gradient(to bottom right, #0A071D, #1D0643);
        }

        /* ABSTRACT SHAPES */
        .abstract-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(3rem);
          z-index: 0;
        }
        .shape-one {
          width: 600px;
          height: 600px;
          top: -20%;
          left: -20%;
          background: linear-gradient(to top right, purple, pink);
        }
        .shape-two {
          width: 700px;
          height: 700px;
          bottom: -30%;
          right: -30%;
          background: linear-gradient(to bottom right, indigo, cyan);
        }

        /* HEADER / NAV */
        .header {
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
        }
        .logo {
          font-size: 1.25rem;
          font-weight: bold;
          letter-spacing: 0.05em;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-links a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: color 0.3s;
        }
        .nav-links a:hover {
          color: #fff;
        }

        /* HERO SECTION */
        .hero {
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-title {
          font-size: 2rem;
          font-weight: bold;
          line-height: 1.3;
          margin-bottom: 1rem;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
        }
        .hero-subtitle {
          color: rgba(255,255,255,0.8);
          margin-bottom: 2rem;
        }
        .hero-cta {
          margin-top: 1rem;
        }

        /* BUTTONS */
        .btn {
          border: none;
          cursor: pointer;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-size: 1rem;
          transition: opacity 0.3s;
        }
        .btn:focus {
          outline: none;
        }
        .gradient-pink {
          background: linear-gradient(to right, #FF0099, #FF7E00);
          color: #fff;
        }
        .gradient-green {
          background: linear-gradient(to right, #7fff00, #00ff00);
          color: #000;
          font-weight: 600;
        }
        .btn:hover {
          opacity: 0.9;
        }

        /* SECTIONS */
        .section-wrapper {
          z-index: 10;
          padding: 3rem 1rem;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }
        .section-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2.5rem;
        }
        .card-grid {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .card-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .card {
          background: rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: left;
        }
        .card-title {
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
        }
        .card-text {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
        }

        /* RISK SECTION */
        .risk-text {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 1rem;
          color: rgba(255,255,255,0.8);
          max-width: 700px;
          margin: 0 auto;
        }

        /* SIGNUP SECTION */
        .cta-subtext {
          color: rgba(255,255,255,0.8);
          max-width: 600px;
          margin: 0.5rem auto 1rem auto;
        }

        /* FOOTER */
        .footer {
          z-index: 10;
          text-align: center;
          padding: 1rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
        }

      `}</style>
    </>
  );
}
