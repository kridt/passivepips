import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const S = {
  page: {
    minHeight: "100vh",
    padding: "5rem 1.5rem 4rem",
    fontFamily: "'Instrument Sans', sans-serif",
    color: "#E2E8F0",
    background: "#080A12",
  },
  inner: {
    maxWidth: "740px",
    margin: "0 auto",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    color: "rgba(226,232,240,0.5)",
    fontSize: "0.85rem",
    textDecoration: "none",
    marginBottom: "2.5rem",
    transition: "color 0.2s",
  },
  badge: {
    display: "inline-block",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#A5D7E8",
    background: "rgba(165,215,232,0.08)",
    border: "1px solid rgba(165,215,232,0.15)",
    borderRadius: "20px",
    padding: "0.3rem 0.85rem",
    marginBottom: "1rem",
  },
  h1: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
    fontWeight: 800,
    color: "#E2E8F0",
    lineHeight: 1.2,
    marginBottom: "0.75rem",
  },
  meta: {
    fontSize: "0.85rem",
    color: "rgba(226,232,240,0.4)",
    marginBottom: "3rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid rgba(165,215,232,0.07)",
  },
  h2: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#A5D7E8",
    marginTop: "2.5rem",
    marginBottom: "0.75rem",
  },
  p: {
    fontSize: "0.925rem",
    lineHeight: 1.8,
    color: "rgba(226,232,240,0.72)",
    marginBottom: "1rem",
  },
  ul: {
    paddingLeft: "1.25rem",
    marginBottom: "1rem",
  },
  li: {
    fontSize: "0.925rem",
    lineHeight: 1.8,
    color: "rgba(226,232,240,0.72)",
    marginBottom: "0.35rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
  },
  th: {
    textAlign: "left",
    padding: "0.6rem 0.75rem",
    fontWeight: 600,
    color: "rgba(226,232,240,0.6)",
    background: "rgba(165,215,232,0.04)",
    borderBottom: "1px solid rgba(165,215,232,0.08)",
    fontSize: "0.8rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  td: {
    padding: "0.6rem 0.75rem",
    color: "rgba(226,232,240,0.7)",
    borderBottom: "1px solid rgba(165,215,232,0.05)",
    verticalAlign: "top",
    lineHeight: 1.6,
  },
  disclaimer: {
    marginTop: "3rem",
    padding: "1.25rem 1.5rem",
    background: "rgba(251,113,133,0.05)",
    border: "1px solid rgba(251,113,133,0.12)",
    borderRadius: "10px",
    fontSize: "0.8rem",
    color: "rgba(226,232,240,0.45)",
    lineHeight: 1.7,
  },
  contact: {
    marginTop: "2rem",
    padding: "1.25rem 1.5rem",
    background: "rgba(165,215,232,0.03)",
    border: "1px solid rgba(165,215,232,0.08)",
    borderRadius: "10px",
  },
};

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | PassivePips</title>
        <meta name="description" content="PassivePips privacy policy — how we collect, use, and protect your data. GDPR-compliant cookie and analytics information." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div style={S.page}>
        <div style={S.inner}>
          <Link to="/" style={S.back}>← Back to PassivePips</Link>

          <div style={S.badge}>Legal</div>
          <h1 style={S.h1}>Privacy Policy</h1>
          <p style={S.meta}>Last updated: March 2026 &nbsp;·&nbsp; PassivePips (passivepips.com)</p>

          <p style={S.p}>
            This Privacy Policy explains how PassivePips ("we", "us", or "our") collects,
            uses, and protects information when you visit <strong style={{ color: "#E2E8F0" }}>passivepips.com</strong>.
            We are committed to protecting your privacy and complying with the General Data
            Protection Regulation (GDPR) and applicable data protection laws.
          </p>

          {/* ── 1. Data Collected ── */}
          <h2 style={S.h2}>1. What Data We Collect</h2>
          <p style={S.p}>We collect limited data only when you interact with the site:</p>
          <ul style={S.ul}>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Analytics data</strong> (only with your consent) — page views, session duration, referring URL, browser type, device type, and approximate geographic location (country/city level) via Google Analytics 4.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Contact form submissions</strong> — name, email address, and any message content you voluntarily provide. This is transmitted via EmailJS and is not stored on our servers.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Cookie preference</strong> — your accept/decline decision is stored in your browser's localStorage to avoid asking you again on repeat visits.</li>
          </ul>
          <p style={S.p}>
            We do <strong style={{ color: "#E2E8F0" }}>not</strong> collect names, email addresses, or any personal information
            from visitors unless you voluntarily submit a contact form.
          </p>

          {/* ── 2. Why We Collect It ── */}
          <h2 style={S.h2}>2. Why We Collect It</h2>
          <ul style={S.ul}>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Analytics</strong> — to understand which pages are most useful, how visitors navigate the site, and to improve the overall experience.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Contact form</strong> — to respond to enquiries about PAMM investing.</li>
          </ul>
          <p style={S.p}>
            Analytics tracking is only activated after you explicitly accept cookies via the consent
            banner. If you decline, no analytics data is collected.
          </p>

          {/* ── 3. Cookies ── */}
          <h2 style={S.h2}>3. Cookies &amp; Local Storage</h2>
          <p style={S.p}>
            We use cookies and browser storage as described below. No cookies are set before
            you give consent (except the preference record itself, which is stored in localStorage
            and contains no personal data).
          </p>

          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Cookie / Key</th>
                <th style={S.th}>Source</th>
                <th style={S.th}>Purpose</th>
                <th style={S.th}>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={S.td}><code style={{ color: "#A5D7E8" }}>CookieConsent</code></td>
                <td style={S.td}>PassivePips</td>
                <td style={S.td}>Stores your cookie consent preference (localStorage)</td>
                <td style={S.td}>Persistent (browser storage)</td>
              </tr>
              <tr>
                <td style={S.td}><code style={{ color: "#A5D7E8" }}>_ga</code></td>
                <td style={S.td}>Google Analytics</td>
                <td style={S.td}>Distinguishes unique visitors</td>
                <td style={S.td}>2 years</td>
              </tr>
              <tr>
                <td style={S.td}><code style={{ color: "#A5D7E8" }}>_ga_*</code></td>
                <td style={S.td}>Google Analytics</td>
                <td style={S.td}>Persists session state for GA4</td>
                <td style={S.td}>2 years</td>
              </tr>
            </tbody>
          </table>

          <p style={S.p}>
            Google Analytics cookies are only set after you accept. Google may process data on
            servers located outside the EU/EEA. Google LLC is certified under the EU-US Data
            Privacy Framework, providing an adequate level of protection.
          </p>

          {/* ── 4. Third-Party Services ── */}
          <h2 style={S.h2}>4. Third-Party Services</h2>
          <ul style={S.ul}>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Google Analytics 4</strong> (Google LLC) — website traffic analysis. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#A5D7E8" }}>Google Privacy Policy</a>.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Vercel</strong> — website hosting. Vercel may log IP addresses for security and abuse prevention. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#A5D7E8" }}>Vercel Privacy Policy</a>.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>EmailJS</strong> — contact form delivery. Messages are transmitted through EmailJS servers and are not stored by us. <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: "#A5D7E8" }}>EmailJS Privacy Policy</a>.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Vantage Markets</strong> — our affiliated broker for PAMM investing. If you click through to Vantage Markets and open an account, their privacy policy applies.</li>
          </ul>

          {/* ── 5. Your GDPR Rights ── */}
          <h2 style={S.h2}>5. Your Rights Under GDPR</h2>
          <p style={S.p}>If you are located in the EU/EEA, you have the following rights:</p>
          <ul style={S.ul}>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Right of access</strong> — request a copy of the personal data we hold about you.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Right to rectification</strong> — request correction of inaccurate data.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Right to erasure</strong> — request deletion of your personal data.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Right to restrict processing</strong> — ask us to limit how we use your data.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Right to object</strong> — object to processing of your personal data.</li>
            <li style={S.li}><strong style={{ color: "#E2E8F0" }}>Right to withdraw consent</strong> — you can withdraw cookie consent at any time (see below).</li>
          </ul>

          {/* ── 6. Withdraw Consent ── */}
          <h2 style={S.h2}>6. How to Withdraw Consent</h2>
          <p style={S.p}>You can withdraw your cookie consent at any time by either:</p>
          <ul style={S.ul}>
            <li style={S.li}>Clearing your browser's localStorage and cookies, then revisiting the site — the banner will reappear.</li>
            <li style={S.li}>Using your browser's built-in cookie management tools to delete <code style={{ color: "#A5D7E8" }}>_ga</code> and <code style={{ color: "#A5D7E8" }}>_ga_*</code> cookies.</li>
            <li style={S.li}>Installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "#A5D7E8" }}>Google Analytics Opt-out Browser Add-on</a>.</li>
          </ul>
          <p style={S.p}>
            Withdrawing consent will not affect the lawfulness of any processing carried out
            before you withdrew consent.
          </p>

          {/* ── 7. Data Retention ── */}
          <h2 style={S.h2}>7. Data Retention</h2>
          <p style={S.p}>
            Analytics data is retained in Google Analytics for 14 months (the minimum supported
            retention period). Contact form messages are retained only as long as needed to respond
            to your enquiry. We do not maintain any server-side database of visitor data.
          </p>

          {/* ── 8. Contact ── */}
          <h2 style={S.h2}>8. Contact</h2>
          <div style={S.contact}>
            <p style={{ ...S.p, marginBottom: 0 }}>
              For any privacy-related questions or to exercise your rights, contact us at:<br />
              <a href="mailto:info@passivepips.com" style={{ color: "#A5D7E8", fontWeight: 600 }}>info@passivepips.com</a>
            </p>
          </div>

          {/* ── Disclaimer ── */}
          <div style={S.disclaimer}>
            <strong style={{ color: "rgba(226,232,240,0.6)", display: "block", marginBottom: "0.4rem" }}>Financial Risk Disclaimer</strong>
            Trading forex and other financial instruments involves significant risk of loss and is not suitable for all investors.
            Past performance is not indicative of future results. The information on this website is for informational purposes only
            and does not constitute financial advice. Only invest what you can afford to lose. PassivePips does not guarantee any
            specific returns. Please ensure you fully understand the risks involved before investing.
          </div>
        </div>
      </div>
    </>
  );
}
