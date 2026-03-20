import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const s = {
  page: {
    minHeight: "100vh",
    padding: "5rem 1.5rem 4rem",
    maxWidth: "760px",
    margin: "0 auto",
    fontFamily: "var(--font-body)",
    color: "var(--text)",
  },
  h1: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
    fontWeight: 800,
    color: "var(--accent)",
    marginBottom: "0.4rem",
  },
  updated: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    marginBottom: "2.5rem",
    display: "block",
  },
  h2: {
    fontFamily: "var(--font-display)",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "rgba(226,232,240,0.9)",
    marginTop: "2.2rem",
    marginBottom: "0.6rem",
  },
  p: {
    fontSize: "0.9rem",
    lineHeight: 1.75,
    color: "rgba(226,232,240,0.65)",
    marginBottom: "0.8rem",
  },
  ul: {
    fontSize: "0.9rem",
    lineHeight: 1.75,
    color: "rgba(226,232,240,0.65)",
    paddingLeft: "1.4rem",
    marginBottom: "0.8rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    marginBottom: "1rem",
  },
  th: {
    textAlign: "left",
    padding: "0.5rem 0.75rem",
    background: "rgba(165,215,232,0.04)",
    border: "1px solid rgba(165,215,232,0.08)",
    color: "rgba(226,232,240,0.7)",
    fontWeight: 600,
  },
  td: {
    padding: "0.5rem 0.75rem",
    border: "1px solid rgba(165,215,232,0.08)",
    color: "rgba(226,232,240,0.55)",
    verticalAlign: "top",
  },
  disclaimer: {
    marginTop: "3rem",
    padding: "1.25rem",
    background: "rgba(165,215,232,0.03)",
    border: "1px solid rgba(165,215,232,0.08)",
    borderRadius: "10px",
    fontSize: "0.78rem",
    lineHeight: 1.7,
    color: "rgba(226,232,240,0.4)",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.82rem",
    color: "var(--text-muted)",
    textDecoration: "none",
    marginBottom: "2.5rem",
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | PassivePips</title>
        <meta name="description" content="How PassivePips collects and uses data, your GDPR rights, and cookie details." />
      </Helmet>

      <div style={s.page}>
        <Link to="/" style={s.back}>← Back to home</Link>

        <h1 style={s.h1}>Privacy Policy</h1>
        <span style={s.updated}>Last updated: 20 March 2026</span>

        <p style={s.p}>
          This policy explains how PassivePips ("we", "us") collects, uses, and protects information
          about visitors to <strong>passivepips.com</strong>. We take your privacy seriously and
          process data only where we have a lawful basis to do so under the GDPR.
        </p>

        <h2 style={s.h2}>1. Who we are</h2>
        <p style={s.p}>
          PassivePips is operated as a personal investment information website. For privacy enquiries,
          contact us via the contact form on the home page.
        </p>

        <h2 style={s.h2}>2. What data Google Analytics 4 collects</h2>
        <p style={s.p}>
          If you consent to analytics cookies, we use Google Analytics 4 (GA4) to collect anonymised
          usage data. GA4 may collect:
        </p>
        <ul style={s.ul}>
          <li>Pages visited and time spent on each page</li>
          <li>General geographic location (country/city level, derived from IP address)</li>
          <li>Browser type, operating system, and device category</li>
          <li>Referral source (how you arrived at the site)</li>
          <li>Events such as clicks and scroll depth</li>
        </ul>
        <p style={s.p}>
          GA4 is configured with IP anonymisation. We do not enable Google Signals or cross-site
          tracking. Data is processed by Google LLC under their standard contractual clauses.
          For more information see{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google's Privacy Policy
          </a>.
        </p>

        <h2 style={s.h2}>3. Why we collect this data</h2>
        <p style={s.p}>
          Analytics data helps us understand which content is useful, improve the site, and diagnose
          technical issues. The legal basis is your <strong>consent</strong> (GDPR Art. 6(1)(a)),
          given when you click "Accept" on the cookie banner.
        </p>

        <h2 style={s.h2}>4. Cookie details</h2>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Name</th>
              <th style={s.th}>Provider</th>
              <th style={s.th}>Purpose</th>
              <th style={s.th}>Expiry</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={s.td}>_ga</td>
              <td style={s.td}>Google Analytics</td>
              <td style={s.td}>Distinguishes unique users</td>
              <td style={s.td}>2 years</td>
            </tr>
            <tr>
              <td style={s.td}>_ga_*</td>
              <td style={s.td}>Google Analytics</td>
              <td style={s.td}>Maintains session state</td>
              <td style={s.td}>2 years</td>
            </tr>
            <tr>
              <td style={s.td}>passivepips-cookie-consent</td>
              <td style={s.td}>PassivePips</td>
              <td style={s.td}>Stores your cookie preference</td>
              <td style={s.td}>Persistent (localStorage)</td>
            </tr>
          </tbody>
        </table>
        <p style={s.p}>
          The consent preference is stored in <strong>localStorage</strong>, not as a cookie, and
          never transmitted to any server.
        </p>

        <h2 style={s.h2}>5. Your rights under GDPR</h2>
        <p style={s.p}>If you are in the EEA or UK, you have the right to:</p>
        <ul style={s.ul}>
          <li><strong>Access</strong> the personal data we hold about you</li>
          <li><strong>Rectification</strong> of inaccurate data</li>
          <li><strong>Erasure</strong> ("right to be forgotten")</li>
          <li><strong>Restriction</strong> of processing</li>
          <li><strong>Data portability</strong></li>
          <li><strong>Object</strong> to processing based on legitimate interests</li>
          <li><strong>Withdraw consent</strong> at any time (see section 6)</li>
        </ul>
        <p style={s.p}>
          To exercise your rights, contact us via the home page contact form or submit a data
          deletion request directly to Google via{" "}
          <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noopener noreferrer">
            Google's Data & Privacy page
          </a>.
        </p>

        <h2 style={s.h2}>6. How to withdraw consent</h2>
        <p style={s.p}>
          You can withdraw your analytics consent at any time. To do so, open your browser's
          developer tools, go to <strong>Application → Local Storage</strong>, find
          the key <code>passivepips-cookie-consent</code>, and delete or change its value
          to <code>declined</code>. Then reload the page — GA4 will not load.
        </p>
        <p style={s.p}>
          You can also install the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics Opt-out Browser Add-on
          </a>{" "}
          to prevent GA4 from collecting data across all sites.
        </p>

        <h2 style={s.h2}>7. Third-party services</h2>
        <p style={s.p}>
          This site uses <strong>Vercel</strong> for hosting and <strong>Vercel Analytics</strong>
          {" "}for privacy-friendly, cookieless traffic metrics. Vercel does not use cookies and
          processes only aggregate, anonymised data. See{" "}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Vercel's Privacy Policy
          </a>.
        </p>

        <h2 style={s.h2}>8. Data retention</h2>
        <p style={s.p}>
          GA4 data is retained for 14 months in Google Analytics before automatic deletion.
          We do not export or store GA4 data elsewhere.
        </p>

        <h2 style={s.h2}>9. Changes to this policy</h2>
        <p style={s.p}>
          We may update this policy from time to time. The "Last updated" date at the top
          of this page reflects the most recent revision. Continued use of the site after
          an update constitutes acceptance of the revised policy.
        </p>

        <div style={s.disclaimer}>
          <strong>Financial Risk Disclaimer:</strong> Trading forex and other leveraged financial
          instruments carries a high level of risk and may not be suitable for all investors.
          Past performance is not indicative of future results. The information on this site is
          provided for informational purposes only and does not constitute financial advice.
          You should seek independent financial advice before making any investment decision.
          You could lose some or all of your invested capital; do not invest money you cannot
          afford to lose.
        </div>
      </div>
    </>
  );
}
