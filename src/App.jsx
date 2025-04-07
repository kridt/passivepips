import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CookieConsent from "react-cookie-consent";
import emailjs from "emailjs-com"; // ← EmailJS import
import { Helmet } from "react-helmet";
import { Link } from "react-scroll";

// Dynamically inject Google Tag script when user accepts cookies
function loadGoogleTag() {
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-VTXGBE39QS";
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", "G-VTXGBE39QS");
}

export default function App() {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // If user accepted cookies in a previous session, we could load Google Tag here
  }, []);

  // Når brugeren accepterer cookies:
  function handleAcceptCookies() {
    setCookiesAccepted(true);
    loadGoogleTag();
  }

  function handleDeclineCookies() {
    console.log("Cookies declined");
  }

  // Smooth scrolling til sektioner:
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Form submission → sender mail til dig + auto-reply til bruger
  function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userEmail = formData.get("email");
    const subject = formData.get("subject");
    const question = formData.get("question");

    // 1) Send mail til dig (template_xks9xsp)
    emailjs
      .send(
        "service_ur52gfn", // <-- Indsæt dit EmailJS Service ID
        "template_xks9xsp",
        {
          user_email: userEmail,
          subject: subject,
          message: question,
        },
        "0nDd8UpcZnJ6z1LWJ" // Public Key
      )
      .then(() => {
        console.log("Mail to admin sent");
      })
      .catch((err) => {
        console.error("Admin mail error", err);
      });

    // 2) Send auto-svar til brugeren (template_ytsnfct)
    emailjs
      .send(
        "service_ur52gfn",
        "template_ytsnfct",
        {
          to_email: userEmail,
          subject: subject,
          message: question,
        },
        "0nDd8UpcZnJ6z1LWJ"
      )
      .then(() => {
        console.log("Auto-reply sent to user");
      })
      .catch((err) => {
        console.error("Auto-reply error", err);
      });

    alert("Form submitted!");
    e.target.reset();
  }

  return (
    <>
      <Helmet>
        <title>Passive Pips | Automated Trading. Passive Income.</title>
        <meta
          name="description"
          content="Start earning passive income using automated trading strategies powered by AI. Simple. Scalable. Secure."
        />
        <meta
          name="keywords"
          content="automated trading, passive income, crypto bots, AI trading, passivepips"
        />
        <meta property="og:title" content="Passive Pips" />
        <meta
          property="og:description"
          content="Earn passive income with automated trading strategies. Powered by AI."
        />
        <meta property="og:url" content="https://passivepips.com" />
        <meta
          property="og:image"
          content="https://passivepips.com/og-preview.jpg"
        />

        <script type="application/ld+json">
          {`
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Passive Pips",
        "url": "https://passivepips.com",
        "description": "Earn passive income using AI-powered trading bots.",
        "publisher": {
          "@type": "Organization",
          "name": "Passive Pips"
        }
      }
    `}
        </script>
      </Helmet>
      <div className="main-wrapper">
        {/* Animated Abstract Backgrounds */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.6, scale: 1, rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="abstract-shape shape-one"
        />
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
        />

        {/* HEADER / NAV */}
        <header className="header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={() => scrollToSection("home")}
          >
            PassivePips
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="nav-links"
          >
            <Link
              to="contact"
              smooth={true}
              duration={500}
              offset={-50} // justér alt efter sticky header
              spy={true}
              isDynamic={true}
              style={{
                cursor: "pointer",
              }}
            >
              Contact
            </Link>

            <Link
              to="guide"
              smooth={true}
              duration={500}
              offset={-50}
              spy={true}
              isDynamic={true}
              style={{
                cursor: "pointer",
              }}
            >
              Guide
            </Link>
          </motion.nav>
        </header>

        {/* HERO / HOME SECTION */}
        <section className="hero" id="home">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            <h1
              style={{
                fontSize: ".8em",
              }}
            >
              Earn Consistent Forex Returns
              <br />
              With Zero Hidden Fees
            </h1>
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
            <button
              className="btn gradient-pink"
              onClick={() => scrollToSection("guide")}
            >
              Get Started
            </button>
          </motion.div>
        </section>

        {/* HOW IT WORKS SECTION */}
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
              {
                title: "4. Withdraw or Reinvest",
                text: "Reinvest profits for compounding growth or withdraw at will—your choice.",
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

        {/* RISK SECTION */}
        <section className="section-wrapper">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-title"
          >
            Risk & Transparency
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
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

        {/* GUIDE SECTION */}
        <section
          id="guide"
          className="section-wrapper"
          style={{ marginTop: "2rem" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Detailed Setup Guide
          </motion.h2>
          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.6,
              textAlign: "left",
            }}
          >
            <ol style={{ listStyle: "none", padding: 0, counterReset: "step" }}>
              <li
                style={{
                  marginBottom: "1.5rem",
                  position: "relative",
                  paddingLeft: "2.2rem",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "1.8rem",
                    height: "1.8rem",
                    background: "#FF7E00",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    counterIncrement: "step",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>1</span>
                </span>
                <strong>Open an Account</strong>
                <br />
                Click our{" "}
                <a
                  href="https://www.vantagemarkets.com/open-live-account/?affid=MTQ2OTEz"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#FF7E00" }}
                >
                  affiliate link
                </a>{" "}
                to open a Vantage account. If you already have one, skip to Step
                3.
              </li>
              <li
                style={{
                  marginBottom: "1.5rem",
                  position: "relative",
                  paddingLeft: "2.2rem",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "1.8rem",
                    height: "1.8rem",
                    background: "#FF7E00",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    counterIncrement: "step",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>2</span>
                </span>
                <strong>Verify Your Account</strong>
                <br />
                Complete the standard verification process (KYC) to fully
                activate your new account.
              </li>
              <li
                style={{
                  marginBottom: "1.5rem",
                  position: "relative",
                  paddingLeft: "2.2rem",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "1.8rem",
                    height: "1.8rem",
                    background: "#FF7E00",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    counterIncrement: "step",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>3</span>
                </span>
                <strong>Create a PAMM MT4 Account</strong>
                <br />
                You’ll receive an email with your new account number and
                password once it’s created.
              </li>
              <li
                style={{
                  marginBottom: "1.5rem",
                  position: "relative",
                  paddingLeft: "2.2rem",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "1.8rem",
                    height: "1.8rem",
                    background: "#FF7E00",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    counterIncrement: "step",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>4</span>
                </span>
                <strong>Deposit Funds</strong>
                <br />
                Our minimum is <strong>$10</strong>. Simply deposit into your
                PAMM trading account.
              </li>
              <li
                style={{
                  marginBottom: "1.5rem",
                  position: "relative",
                  paddingLeft: "2.2rem",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "1.8rem",
                    height: "1.8rem",
                    background: "#FF7E00",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    counterIncrement: "step",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>5</span>
                </span>
                <strong>Join Our PAMM</strong>
                <br />
                Go to{" "}
                <a
                  href="https://pamm.vantagemarkets.com/app/join/1458/passivepips"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#FF7E00" }}
                >
                  this link
                </a>
                , log in with your PAMM credentials, and request to allocate
                your deposited funds.
              </li>
              <li
                style={{
                  marginBottom: "1.5rem",
                  position: "relative",
                  paddingLeft: "2.2rem",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "1.8rem",
                    height: "1.8rem",
                    background: "#FF7E00",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    counterIncrement: "step",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>6</span>
                </span>
                <strong>Approval & Monitoring</strong>
                <br />
                We approve new investments <strong>once a week</strong>. After
                approval, track your investment anytime via{" "}
                <a
                  href="https://pamm.vantagemarkets.com/app/auth/investor"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#FF7E00" }}
                >
                  this link
                </a>
                .
              </li>
            </ol>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section
          id="contact"
          className="section-wrapper"
          style={{ marginTop: "2rem" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Contact Us
          </motion.h2>

          <motion.form
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleContactForm}
            style={{
              width: "100%",
              maxWidth: "600px", // Bredere men stadig responsivt
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              textAlign: "left",
            }}
          >
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <label htmlFor="question">Question</label>
            <textarea
              id="question"
              name="question"
              rows={5}
              required
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <button
              type="submit"
              className="btn gradient-green"
              style={{ alignSelf: "flex-start", marginTop: "1rem" }}
            >
              Send
            </button>
          </motion.form>
        </section>

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

        /* CONTACT FORM */
        form label {
          margin-bottom: 0.25rem;
          font-weight: 600;
        }
        form input, form textarea {
          width: 100%;
          margin-bottom: 0.75rem;
        }

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
