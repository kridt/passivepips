import { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import { inject } from "@vercel/analytics";
import "./App.css";

const Home = lazy(() => import("./pages/Home.jsx"));
const BlogList = lazy(() => import("./pages/BlogList.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/* ─── Vercel Web Analytics ─── */
inject();

/* ─── GA4 — only called after explicit cookie consent ─── */
const GA4_ID = "G-40C17RXPHY";

function loadGoogleTag() {
  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA4_ID, { anonymize_ip: true });
}

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        style={{
          background: "rgba(8,10,18,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(165,215,232,0.08)",
          padding: "1rem 1.5rem",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
        contentStyle={{
          flex: "1 1 300px",
          margin: 0,
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "0.83rem",
          color: "rgba(226,232,240,0.72)",
          lineHeight: 1.6,
        }}
        buttonWrapperClasses="cookie-btn-wrap"
        buttonStyle={{
          background: "#A5D7E8",
          color: "#080A12",
          fontSize: "0.83rem",
          fontWeight: 600,
          fontFamily: "'Instrument Sans', sans-serif",
          borderRadius: "8px",
          padding: "0.5rem 1.25rem",
          margin: 0,
          cursor: "pointer",
          border: "none",
        }}
        declineButtonStyle={{
          background: "transparent",
          border: "1px solid rgba(165,215,232,0.18)",
          color: "rgba(226,232,240,0.45)",
          fontSize: "0.83rem",
          fontFamily: "'Instrument Sans', sans-serif",
          borderRadius: "8px",
          padding: "0.5rem 1.25rem",
          margin: "0 0.5rem 0 0",
          cursor: "pointer",
        }}
        onAccept={loadGoogleTag}
        onDecline={() => {}}
      >
        We use cookies to analyse site traffic and improve your experience.{" "}
        <Link
          to="/privacy"
          style={{ color: "#A5D7E8", textDecoration: "underline", textUnderlineOffset: "2px", fontSize: "inherit" }}
        >
          Privacy Policy
        </Link>
      </CookieConsent>
    </>
  );
}
