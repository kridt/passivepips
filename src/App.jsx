import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import { inject } from "@vercel/analytics";
import "./App.css";

const Home = lazy(() => import("./pages/Home.jsx"));
const BlogList = lazy(() => import("./pages/BlogList.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/* ─── Vercel Web Analytics ─── */
inject();

/* ─── GA4 ─── */
function loadGoogleTag() {
  const s = document.createElement("script");
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-VTXGBE39QS";
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", "G-VTXGBE39QS");
}

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        style={{ background: "rgba(8,10,18,0.95)", backdropFilter: "blur(20px)", fontSize: "0.82rem", fontFamily: "'Instrument Sans', sans-serif", borderTop: "1px solid rgba(165,215,232,0.08)", padding: "1rem 1.5rem" }}
        buttonStyle={{ background: "var(--accent)", color: "#080A12", fontSize: "0.82rem", fontWeight: 600, borderRadius: "8px", padding: "0.5rem 1.25rem" }}
        declineButtonStyle={{ background: "transparent", border: "1px solid rgba(165,215,232,0.15)", color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", borderRadius: "8px", padding: "0.5rem 1.25rem", margin: "0 10px" }}
        onAccept={loadGoogleTag}
        onDecline={() => {}}
      >
        This site uses cookies for analytics. Accept or decline.
      </CookieConsent>
    </>
  );
}
