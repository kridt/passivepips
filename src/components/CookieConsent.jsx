import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "passivepips-cookie-consent";
const GA4_ID = "G-40C17RXPHY";

function loadGA4() {
  if (window.__ga4Loaded) return;
  window.__ga4Loaded = true;
  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA4_ID);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted") {
      loadGA4();
    } else if (!stored) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    loadGA4();
  }

  function handleDecline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9000,
      background: "rgba(8,10,18,0.96)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(165,215,232,0.08)",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      flexWrap: "wrap",
      fontFamily: "var(--font-body)",
      fontSize: "0.82rem",
      color: "rgba(226,232,240,0.65)",
    }}>
      <span>
        This site uses analytics cookies to understand visitor behaviour.{" "}
        <Link to="/privacy" style={{ color: "var(--accent)", textDecoration: "underline" }}>
          Privacy Policy
        </Link>
      </span>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            background: "transparent",
            border: "1px solid rgba(165,215,232,0.15)",
            color: "rgba(226,232,240,0.5)",
            fontSize: "0.82rem",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            borderRadius: "8px",
            padding: "0.45rem 1.1rem",
            cursor: "pointer",
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            background: "var(--accent)",
            border: "none",
            color: "#080A12",
            fontSize: "0.82rem",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            borderRadius: "8px",
            padding: "0.45rem 1.1rem",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
