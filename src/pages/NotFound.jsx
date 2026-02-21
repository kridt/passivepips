import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | PassivePips</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "'Instrument Sans', sans-serif",
      }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(3rem, 10vw, 6rem)",
          fontWeight: 800,
          color: "rgba(165,215,232,0.15)",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}>
          404
        </h1>
        <p style={{
          fontSize: "1.1rem",
          color: "rgba(226,232,240,0.6)",
          marginBottom: "2rem",
          maxWidth: "400px",
        }}>
          This page doesn't exist. It may have been moved or removed.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.5rem",
              background: "#A5D7E8",
              color: "#080A12",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.5rem",
              background: "transparent",
              color: "rgba(226,232,240,0.7)",
              border: "1px solid rgba(165,215,232,0.15)",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Blog
          </Link>
        </div>
      </div>
    </>
  );
}
