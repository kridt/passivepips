import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CookieConsent from "react-cookie-consent";

// Dynamically inject Google Tag script when user accepts cookies
function loadGoogleTag() {
  // 1) Insert the official gtag script tag
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-VTXGBE39QS";
  script.async = true;
  document.head.appendChild(script);

  // 2) Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  // Expose gtag globally
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", "G-VTXGBE39QS");
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState("home");

  useEffect(() => {
    setMounted(true);
  }, []);

  const HomePage = (
    <>
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
          <a
            href="https://www.vantagemarkets.com/open-live-account/?affid=MTQ2OTEz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn gradient-pink"
          >
            Get Started
          </a>
        </motion.div>
      </section>

      <section className="section-wrapper">
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

      <section className="section-wrapper">
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
            Trading Forex involves risk. We employ a 40% stop-loss mechanism to
            prevent substantial losses. No strategy is guaranteed. Only invest
            what you can afford to lose.
          </p>
          <p>
            We earn through an affiliate agreement with the broker, so you pay
            nothing directly. You keep your profits.
          </p>
        </motion.div>
      </section>
    </>
  );

  const GuidePage = (
    <section className="section-wrapper" style={{ marginTop: "4rem" }}>
      <h2 className="section-title">Detailed Setup Guide</h2>
      <p
        style={{
          color: "rgba(255,255,255,0.8)",
          maxWidth: "700px",
          margin: "0 auto",
          lineHeight: 1.6,
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
        vehicula mollis risus, ac auctor lorem fermentum non. Quisque aliquet
        magna non tortor interdum, at tincidunt libero laoreet.
      </p>
      <p
        style={{
          color: "rgba(255,255,255,0.8)",
          maxWidth: "700px",
          margin: "1.5rem auto 0 auto",
          lineHeight: 1.6,
        }}
      >
        Donec mi lectus, varius eget sagittis sit amet, tristique vel orci. Duis
        maximus odio lacus, sed tempor tellus ornare a.
      </p>
    </section>
  );

  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  function handleAcceptCookies() {
    setCookiesAccepted(true);
    // Dynamically load the gtag script
    loadGoogleTag();
  }

  const handleDeclineCookies = () => {
    console.log("Cookies declined");
  };

  return (
    <>
      <div className="main-wrapper">
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

        <header className="header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="logo"
            onClick={() => setPage("home")}
            style={{ cursor: "pointer" }}
          >
            PassivePips
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="nav-links"
          >
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setPage("home");
              }}
            >
              Home
            </a>
            <a
              href="#guide"
              onClick={(e) => {
                e.preventDefault();
                setPage("guide");
              }}
            >
              Guide
            </a>
          </motion.nav>
        </header>

        {page === "home" ? HomePage : GuidePage}

        <footer className="footer">
          &copy; {new Date().getFullYear()} PassivePips. All rights reserved.
        </footer>
      </div>

      {/* Cookie Banner */}
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        style={{ background: "rgba(0,0,0,0.7)", fontSize: "0.9rem" }}
        buttonStyle={{
          background: "#FF7E00",
          color: "white",
          fontSize: "0.9rem",
        }}
        declineButtonStyle={{
          background: "gray",
          fontSize: "0.9rem",
          margin: "0 10px",
        }}
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
      >
        This website uses cookies to enhance the user experience. Please accept
        or decline.
      </CookieConsent>

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
          padding: 3rem 1rem;
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
          font-size: 1.1rem;
          line-height: 1.5;
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
          text-decoration: none;
          display: inline-block;
          text-align: center;
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
          line-height: 1.4;
        }

        /* RISK SECTION */
        .risk-text {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-size: 1rem;
          color: rgba(255,255,255,0.8);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* SIGNUP SECTION */
        .cta-subtext {
          color: rgba(255,255,255,0.8);
          max-width: 600px;
          margin: 0.5rem auto 1rem auto;
          line-height: 1.5;
        }

        /* FOOTER */
        .footer {
          z-index: 10;
          text-align: center;
          padding: 1rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
        }

        @media (max-width: 600px) {
          .hero {
            padding: 2rem 1rem;
          }
          .hero-title {
            font-size: 1.75rem;
          }
          .hero-subtitle {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
          }
          .btn {
            font-size: 1rem;
            padding: 0.75rem 1.25rem;
          }
          .card {
            padding: 1.25rem;
          }
          .section-wrapper {
            padding: 2rem 1.25rem;
          }
          .header {
            flex-direction: column;
            gap: 1rem;
          }
          .section-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </>
  );
}
