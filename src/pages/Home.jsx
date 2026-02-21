import { useEffect, useState, useRef, useCallback, lazy, Suspense } from "react";
import { motion, useMotionValue, useTransform, useSpring, useInView, useScroll, animate, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Helmet } from "react-helmet-async";

/* ─── Lazy-loaded Recharts (code-split ~350KB) ─── */
const LazyChart = lazy(() =>
  import("recharts").then((mod) => ({
    default: function RechartsEquityCurve({ data }) {
      const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod;
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(165,215,232,0.06)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(226,232,240,0.3)", fontSize: 11, fontFamily: "'Instrument Sans', sans-serif" }}
              axisLine={{ stroke: "rgba(165,215,232,0.08)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "rgba(226,232,240,0.3)", fontSize: 11, fontFamily: "'Instrument Sans', sans-serif" }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin", "auto"]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const val = payload[0].value;
                return (
                  <div className="chart-tooltip">
                    <span className="chart-tooltip__label">{label}</span>
                    <span className={`chart-tooltip__val ${val >= 0 ? "pos" : "neg"}`}>{val >= 0 ? "+" : ""}{val.toFixed(1)}%</span>
                  </div>
                );
              }}
              cursor={{ stroke: "rgba(165,215,232,0.15)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4ADE80"
              strokeWidth={2.5}
              fill="url(#growthGrad)"
              dot={(props) => {
                const { cx, cy, value, index } = props;
                const isLast = index === data.length - 1;
                return (
                  <g key={index}>
                    <circle cx={cx} cy={cy} r={isLast ? 5 : 3.5} fill={value >= 0 ? "#4ADE80" : "#FB7185"} stroke="rgba(8,10,18,0.8)" strokeWidth={2} />
                    {isLast && <circle cx={cx} cy={cy} r={10} fill="rgba(74,222,128,0.2)" stroke="none" />}
                  </g>
                );
              }}
              activeDot={{ r: 6, fill: "#4ADE80", stroke: "#080A12", strokeWidth: 2 }}
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    },
  }))
);

/* ─── Helpers ─── */
function formatMonth(m) {
  const [y, mo] = m.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[parseInt(mo, 10) - 1]} ${y}`;
}

/* ─── SVG Icons for flow cards ─── */
const FlowIcons = {
  signup: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" />
    </svg>
  ),
};

/* ─── Promo Countdown ─── */
const PROMO_END = new Date("2026-04-01T00:00:00").getTime();

function PromoCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = PROMO_END - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  const isUrgent = timeLeft.days < 7;

  return (
    <motion.div
      className={`promo${isUrgent ? " promo--urgent" : ""}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="promo__pulse" />
      <div className="promo__badge">{isUrgent ? "Ending Soon" : "Limited Time"}</div>
      <div className="promo__content">
        <div className="promo__headline">
          <span className="promo__zero">0%</span> profit share
        </div>
        <p className="promo__sub">This won't last. Lock in <strong>0% fees forever</strong> before the countdown hits zero. After April 1st, all new investors pay a 15% profit share &mdash; no exceptions.</p>
        <div className="promo__timer">
          <div className="promo__unit">
            <span className="promo__num">{String(timeLeft.days).padStart(2, "0")}</span>
            <span className="promo__lbl">Days</span>
          </div>
          <span className="promo__sep">:</span>
          <div className="promo__unit">
            <span className="promo__num">{String(timeLeft.hours).padStart(2, "0")}</span>
            <span className="promo__lbl">Hours</span>
          </div>
          <span className="promo__sep">:</span>
          <div className="promo__unit">
            <span className="promo__num">{String(timeLeft.minutes).padStart(2, "0")}</span>
            <span className="promo__lbl">Min</span>
          </div>
          <span className="promo__sep">:</span>
          <div className="promo__unit">
            <span className="promo__num">{String(timeLeft.seconds).padStart(2, "0")}</span>
            <span className="promo__lbl">Sec</span>
          </div>
        </div>
        <p className="promo__cta">Spots are filling up &mdash; don't miss out.</p>
      </div>
    </motion.div>
  );
}

/* ─── Animated Counter ─── */
function Counter({ value, decimals = 1, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return <span ref={ref} className={className}>{prefix}{display}{suffix}</span>;
}

/* ─── Glow Card ─── */
function GlowCard({ children, className = "", delay = 0 }) {
  const cardRef = useRef(null);
  const glowX = useMotionValue(0.5);
  const glowY = useMotionValue(0.5);

  const handleMouse = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    glowX.set((e.clientX - rect.left) / rect.width);
    glowY.set((e.clientY - rect.top) / rect.height);
  }, [glowX, glowY]);

  const bg = useTransform([glowX, glowY], ([x, y]) =>
    `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(165,215,232,0.07), transparent 50%)`
  );

  return (
    <motion.div
      ref={cardRef}
      className={`glow-card ${className}`}
      onMouseMove={handleMouse}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="glow-card__glow" style={{ background: bg }} />
      <div className="glow-card__inner">{children}</div>
    </motion.div>
  );
}

/* ─── Gain Bar ─── */
function GainBar({ month, gain, trades, maxGain, index }) {
  const barWidth = Math.max(Math.abs(gain) / maxGain * 100, 2);
  const isNeg = gain < 0;

  return (
    <motion.div
      className="gain-row"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="gain-row__label">
        <span className="gain-row__month">{formatMonth(month)}</span>
        <span className="gain-row__trades">{trades} trades</span>
      </div>
      <div className="gain-row__track">
        <motion.div
          className={`gain-row__bar ${isNeg ? "gain-row__bar--neg" : ""}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${barWidth}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className={`gain-row__pct ${isNeg ? "neg" : "pos"}`}>
        {isNeg ? "" : "+"}{gain.toFixed(2)}%
      </span>
    </motion.div>
  );
}

/* ─── Equity Curve Chart (Lazy Recharts) ─── */
function EquityCurve({ months }) {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (inView && !show) setShow(true);
  }, [inView, show]);

  const sorted = [...months].sort((a, b) => a.month.localeCompare(b.month));
  let cumulative = 0;
  const data = sorted.map((m) => {
    cumulative += m.gain;
    return { name: formatMonth(m.month), value: Number(cumulative.toFixed(1)) };
  });

  return (
    <motion.div
      ref={containerRef}
      className="chart-wrap"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      role="img"
      aria-label="Cumulative growth chart showing portfolio performance over time"
    >
      <h3 className="chart-wrap__title">Cumulative Growth</h3>
      {show && (
        <Suspense fallback={<div className="chart-loading">Loading chart...</div>}>
          <LazyChart data={data} />
        </Suspense>
      )}
    </motion.div>
  );
}

/* ─── Floating particles (canvas) ─── */
function ParticleField() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const raf = useRef(null);
  const paused = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(80, Math.floor(w * h / 15000));
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.3 + 0.1,
    }));

    function draw() {
      if (paused.current) { raf.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.02;
          p.vx += dx / dist * force;
          p.vy += dy / dist * force;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 215, 232, ${p.o})`;
        ctx.fill();

        for (let j = i + 1; j < Math.min(i + 20, pts.length); j++) {
          const q = pts[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const d = ddx * ddx + ddy * ddy;
          if (d < 14400) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(165, 215, 232, ${0.06 * (1 - Math.sqrt(d) / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf.current = requestAnimationFrame(draw);
    }
    draw();

    function onMouse(e) { mouse.current = { x: e.clientX, y: e.clientY }; }
    window.addEventListener("mousemove", onMouse);

    function onVisibility() { paused.current = document.hidden; }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

/* ─── Scroll progress line ─── */
function ScrollProgress() {
  const scaleX = useMotionValue(0);
  const spring = useSpring(scaleX, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scaleX.set(h > 0 ? window.scrollY / h : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scaleX]);

  return <motion.div className="scroll-progress" style={{ scaleX: spring }} />;
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={`faq__item ${open ? "faq__item--open" : ""}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="faq__q" onClick={() => setOpen(!open)}>
        {q}
        <motion.svg
          className="faq__chevron"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <path d="M4 6l4 4 4-4" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq__a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="faq__a-inner">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Magnetic Hover Button ─── */
function MagneticWrap({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  function handleMouse(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }
  function reset() { x.set(0); y.set(0); }

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} style={{ x: sx, y: sy, display: "inline-block" }}>
      {children}
    </motion.div>
  );
}

/* ─── Section Divider Effect ─── */
function SectionDivider() {
  return (
    <div className="sect-divider">
      <motion.div
        className="sect-divider__line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="sect-divider__dot"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const blurIn = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
  visible: (i = 0) => ({
    opacity: 1, filter: "blur(0px)", y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── FAQ data ─── */
const faqs = [
  { q: "What is PAMM trading?", a: "PAMM (Percentage Allocation Management Module) lets you invest in a managed trading account. Your funds stay in your own broker account \u2014 we trade on your behalf and profits/losses are shared proportionally. You never give us direct access to your money." },
  { q: "Is my money safe?", a: "Your funds remain in your personal Vantage Markets account at all times. We cannot withdraw or transfer your money. Vantage Markets is regulated by ASIC, FCA, and CIMA. We also use a 40% drawdown stop-loss mechanism to limit risk." },
  { q: "How do I withdraw?", a: "You can withdraw funds anytime through the Vantage PAMM investor portal. There are no lock-in periods or exit fees. Withdrawals are processed by Vantage Markets directly." },
  { q: "What are the fees?", a: "Until April 1st 2026, early investors lock in 0% profit share permanently \u2014 you keep every cent you earn, forever. After the deadline, a 15% profit share applies for all new investors. We also earn through an affiliate partnership with Vantage Markets. There are no hidden fees, no management fees, and no withdrawal fees." },
  { q: "When are new investments approved?", a: "We review and approve new PAMM allocations once per week. After submitting your join request on the PAMM portal, you'll receive confirmation within 7 days." },
];

/* ─────────────────────── HOME PAGE ─────────────────────── */
export default function Home() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fontsReady = document.fonts.ready.then(() => true).catch(() => true);
    const dataReady = fetch(`/performance.json?v=${Date.now()}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setStats(d); setStatsLoading(false); return true; })
      .catch(() => { setStatsLoading(false); return true; });

    Promise.all([fontsReady, dataReady]).then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setReady(true));
      });
    });

    const t = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNav ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNav]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && mobileNav) setMobileNav(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNav]);

  function handleCopy() {
    navigator.clipboard.writeText("VantageInternational-Live 12");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleContactForm(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (fd.get("website")) return;

    setFormStatus("sending");
    const data = { user_email: fd.get("email"), subject: fd.get("subject"), message: fd.get("question") };
    try {
      await Promise.all([
        emailjs.send("service_ur52gfn", "template_xks9xsp", data, "0nDd8UpcZnJ6z1LWJ"),
        emailjs.send("service_ur52gfn", "template_ytsnfct",
          { to_email: fd.get("email"), subject: fd.get("subject"), message: fd.get("question") },
          "0nDd8UpcZnJ6z1LWJ"
        ),
      ]);
      setFormStatus("sent");
      e.target.reset();
      setTimeout(() => setFormStatus("idle"), 4000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 4000);
    }
  }

  function scrollTo(id) {
    setMobileNav(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const navItems = [
    { to: "performance", label: "Results" },
    { to: "about", label: "About" },
    { to: "guide", label: "Guide" },
    { to: "faq", label: "FAQ" },
    { to: "contact", label: "Contact" },
  ];

  const steps = [
    { n: "01", title: "Open an Account", desc: <>Click our <a href="https://www.vantagemarkets.com/open-live-account/?affid=MTQ2OTEz" target="_blank" rel="noopener noreferrer">affiliate link</a> to open a Vantage account. Already have one? Skip to step 03.</> },
    { n: "02", title: "Verify Your Account", desc: "Complete the standard KYC verification process to fully activate your account." },
    { n: "03", title: "Create a PAMM MT4 Account", desc: <>Use MetaTrader 4 as platform and put the server location <code style={{background:'rgba(165,215,232,0.08)',padding:'0.15em 0.45em',borderRadius:'6px',fontSize:'0.82em',color:'var(--accent)',border:'1px solid rgba(165,215,232,0.12)'}}>VantageInternational-Live 12</code> in Additional Note.</>, copy: true },
    { n: "04", title: "Deposit Funds", desc: <>Minimum <strong>$10</strong>. Simply deposit into your PAMM trading account.</> },
    { n: "05", title: "Join Our PAMM", desc: <>Go to the <a href="https://pamm.vantagemarkets.com/app/join/1458/passivepips" target="_blank" rel="noopener noreferrer">PAMM portal</a>, log in and request to allocate your funds.</> },
    { n: "06", title: "Approval & Monitoring", desc: <>We approve new investments <strong>once a week</strong>. Track your investment via the <a href="https://pamm.vantagemarkets.com/app/auth/investor" target="_blank" rel="noopener noreferrer">investor portal</a>.</> },
  ];

  const filteredMonths = stats?.monthlyAnalytics?.filter((r) => r.month !== new Date().toISOString().slice(0, 7)) || [];
  const sortedMonths = [...filteredMonths].sort((a, b) => a.month.localeCompare(b.month));
  const maxGain = Math.max(...filteredMonths.map((r) => Math.abs(r.gain)), 1);

  return (
    <>
      <Helmet>
        <title>PassivePips | Automated Forex PAMM Trading. Passive Income.</title>
      </Helmet>

      {/* Loading curtain */}
      <div className={`loader ${ready ? "loader--done" : ""}`}>
        <div className="loader__content">
          <div className="loader__mark">
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M12 8L17 11V15L12 18L7 15V11L12 8Z" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <div className="loader__bar"><div className="loader__bar-fill" /></div>
        </div>
      </div>

      <div className={`site ${ready ? "site--ready" : ""}`}>
        <ParticleField />
        <ScrollProgress />

        {/* ── HEADER ── */}
        <motion.header
          className={`hdr ${scrolled ? "hdr--solid" : ""}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hdr__inner">
            <button className="hdr__logo" onClick={() => scrollTo("home")} aria-label="PassivePips — Return to top">
              <div className="hdr__mark">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M12 8L17 11V15L12 18L7 15V11L12 8Z" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
              <span className="hdr__name">PassivePips</span>
            </button>
            <nav className={`hdr__nav ${mobileNav ? "hdr__nav--open" : ""}`} onClick={(e) => { if (mobileNav && e.target === e.currentTarget) setMobileNav(false); }}>
              {navItems.map((item) => (
                <a key={item.to} href={`#${item.to}`} className="hdr__link" onClick={(e) => { e.preventDefault(); scrollTo(item.to); }}>
                  {item.label}
                </a>
              ))}
              <a href="#guide" className="hdr__cta" onClick={(e) => { e.preventDefault(); scrollTo("guide"); }}>
                Get Started
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </a>
            </nav>
            <button className={`hdr__burger ${mobileNav ? "hdr__burger--open" : ""}`} onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
          </div>
        </motion.header>

        <main>
        {/* ── HERO ── */}
        <section className="hero" id="home">
          <div className="hero__bg-orb hero__bg-orb--1" />
          <div className="hero__bg-orb hero__bg-orb--2" />
          <div className="hero__bg-orb hero__bg-orb--3" />

          <motion.div className="hero__content" initial="hidden" animate="visible" variants={stagger}>
            <motion.div className="hero__eyebrow" variants={fadeUp} custom={0}>
              <span className="hero__pulse" />
              Automated PAMM Trading
            </motion.div>

            <motion.h1 className="hero__h1" variants={fadeUp} custom={1}>
              <span className="hero__h1-line">Your money,</span>
              <span className="hero__h1-line hero__h1-line--accent">working around</span>
              <span className="hero__h1-line hero__h1-line--accent">the clock</span>
            </motion.h1>

            <motion.p className="hero__sub" variants={fadeUp} custom={2}>
              Consistent forex returns through automated strategies.<br />
              No hidden fees, no lock-in. Just performance.
            </motion.p>

            <PromoCountdown />

            <motion.div className="hero__btns" variants={fadeUp} custom={3}>
              <MagneticWrap strength={0.25}>
                <a className="btn btn--prime btn--glow" href="https://www.vantagemarkets.com/open-live-account/?affid=MTQ2OTEz" target="_blank" rel="noopener noreferrer">
                  Start Investing
                  <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </a>
              </MagneticWrap>
              <MagneticWrap strength={0.2}>
                <button className="btn btn--glass" onClick={() => scrollTo("performance")}>
                  View Track Record
                </button>
              </MagneticWrap>
            </motion.div>
            <motion.p className="hero__min-note" variants={fadeUp} custom={4}>
              Minimum $10 &mdash; withdraw anytime
            </motion.p>
          </motion.div>

          {stats && (
            <motion.div
              className="hero__metrics"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                { val: <Counter value={stats.gain} prefix="+" suffix="%" className="hero__metric-val pos" />, lbl: "Total Return" },
                { val: <Counter value={stats.winRate} suffix="%" className="hero__metric-val pos" />, lbl: "Win Rate" },
                { val: <Counter value={stats.monthsActive} decimals={0} className="hero__metric-val" />, lbl: "Months Active" },
                { val: <Counter value={stats.trades} decimals={0} className="hero__metric-val" />, lbl: "Trades Executed" },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  className="hero__metric"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {m.val}
                  <span className="hero__metric-lbl">{m.lbl}</span>
                </motion.div>
              ))}
              {stats.generatedAt && (
                <motion.span
                  className="hero__metrics-date"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  Updated {new Date(stats.generatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </motion.span>
              )}
            </motion.div>
          )}
        </section>

        <SectionDivider />

        {/* ── PERFORMANCE ── */}
        <section id="performance" className="sect">
          <div className="sect__inner">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.span className="sect__tag" variants={blurIn} custom={0}>Performance</motion.span>
              <motion.h2 className="sect__h2" variants={blurIn} custom={1}>Track Record</motion.h2>
              <motion.p className="sect__desc" variants={blurIn} custom={2}>
                Real results from our automated trading system. Past performance does not guarantee future results.
              </motion.p>
            </motion.div>

            {statsLoading ? (
              <div className="loading">Loading performance data...</div>
            ) : stats ? (
              <>
                <div className="kpi-grid">
                  {[
                    { label: "Total Return", value: stats.gain, suffix: "%", prefix: "+", color: "pos" },
                    { label: "Avg. Monthly", value: stats.monthlyGain, suffix: "%", prefix: "+", color: "pos" },
                    { label: "Win Rate", value: stats.winRate, suffix: "%", color: "pos" },
                    { label: "Profitable Months", raw: `${stats.positiveMonths}/${stats.monthsActive}` },
                    { label: "Total Trades", value: stats.trades, decimals: 0 },
                  ].map((kpi, i) => (
                    <GlowCard key={i} delay={i * 0.1}>
                      <span className={`kpi__val ${kpi.color || ""}`}>
                        {kpi.raw ? kpi.raw : (
                          <Counter value={kpi.value} decimals={kpi.decimals ?? 1} prefix={kpi.prefix || ""} suffix={kpi.suffix || ""} />
                        )}
                      </span>
                      <span className="kpi__lbl">{kpi.label}</span>
                    </GlowCard>
                  ))}
                </div>

                {filteredMonths.length > 0 && (
                  <EquityCurve months={filteredMonths} />
                )}

                {sortedMonths.length > 0 && (
                  <motion.div
                    className="gains"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={scaleIn}
                  >
                    <h3 className="gains__title">Monthly Breakdown</h3>
                    <div className="gains__list">
                      {sortedMonths.slice(0, 12).map((row, i) => (
                        <GainBar
                          key={row.month}
                          month={row.month}
                          gain={Number(row.gain)}
                          trades={row.trades}
                          maxGain={maxGain}
                          index={i}
                        />
                      ))}
                    </div>
                    <p className="gains__note">
                      Aug 2025 excluded due to server breakdown (no trading activity that month).<br />
                      Verify on the <a href="https://pamm.vantagemarkets.com/app/auth/investor" target="_blank" rel="noopener noreferrer">PAMM investor portal</a>
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="loading">Performance data coming soon.</div>
            )}
          </div>
        </section>

        <SectionDivider />

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="sect sect--alt">
          <div className="sect__inner">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.span className="sect__tag" variants={blurIn} custom={0}>Process</motion.span>
              <motion.h2 className="sect__h2" variants={blurIn} custom={1}>How It Works</motion.h2>
            </motion.div>
            <div className="flow">
              {[
                { icon: "01", title: "Sign Up", text: "Create your account with our partnered broker. No setup fee or hidden costs.", iconSvg: FlowIcons.signup },
                { icon: "02", title: "Connect to PAMM", text: "Follow a quick guide to link your account to our automated trading strategy.", iconSvg: FlowIcons.link },
                { icon: "03", title: "Enjoy the Gains", text: "Our algorithm trades 24/7, targeting consistent monthly returns. Withdraw anytime.", iconSvg: FlowIcons.chart },
                { icon: "04", title: "Withdraw or Reinvest", text: "Reinvest profits for compounding growth or withdraw at will \u2014 your choice.", iconSvg: FlowIcons.wallet },
              ].map((step, i) => (
                <GlowCard key={i} className="flow__card" delay={i * 0.12}>
                  <div className="flow__head">
                    <span className="flow__num">{step.icon}</span>
                    <span className="flow__icon">{step.iconSvg}</span>
                  </div>
                  <h3 className="flow__title">{step.title}</h3>
                  <p className="flow__text">{step.text}</p>
                  {i < 3 && <div className="flow__arrow">&#8594;</div>}
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── ABOUT ── */}
        <section id="about" className="sect">
          <div className="sect__inner">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.span className="sect__tag" variants={blurIn} custom={0}>Who's behind this</motion.span>
              <motion.h2 className="sect__h2" variants={blurIn} custom={1}>Meet Christian</motion.h2>
            </motion.div>

            <div className="about">
              <motion.div
                className="about__avatar"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="about__avatar-ring" />
                <div className="about__avatar-inner">C</div>
              </motion.div>

              <motion.div
                className="about__body"
                initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.p variants={fadeUp}>
                  I started PassivePips to give everyday people access to the same automated forex strategies that institutional investors use. With 4 years of trading experience and a focus on risk management, I built a PAMM strategy that prioritises steady, consistent returns over high-risk bets.
                </motion.p>
                <motion.p variants={fadeUp}>
                  My approach is simple: transparency first. You can verify every result on the PAMM portal, I never touch your funds directly, and you can withdraw anytime. I earn only when the broker earns from your trading volume &mdash; so my incentive is to keep you invested and profitable.
                </motion.p>

                <motion.div className="about__stats" variants={fadeUp}>
                  {[
                    { val: "4+", label: "Years Trading" },
                    { val: "24/7", label: "Automated" },
                    { val: "$10", label: "Min. Deposit" },
                  ].map((s, i) => (
                    <div key={i} className="about__stat">
                      <span className="about__stat-val">{s.val}</span>
                      <span className="about__stat-lbl">{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Risk */}
            <motion.div
              className="risk"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="risk__icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <p className="risk__text">
                <strong>Risk Disclosure</strong> &mdash; Trading forex involves risk. We employ a 40% stop-loss mechanism to limit losses, but no strategy is guaranteed. Only invest what you can afford to lose. We earn through an affiliate agreement with the broker &mdash; you pay nothing directly and keep your profits.
              </p>
            </motion.div>
          </div>
        </section>

        <SectionDivider />

        {/* ── SETUP GUIDE ── */}
        <section id="guide" className="sect sect--alt">
          <div className="sect__inner">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.span className="sect__tag" variants={blurIn} custom={0}>Get started</motion.span>
              <motion.h2 className="sect__h2" variants={blurIn} custom={1}>Setup Guide</motion.h2>
              <motion.p className="sect__desc" variants={blurIn} custom={2}>Follow these steps to start investing in under 10 minutes.</motion.p>
            </motion.div>

            <div className="guide">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="guide__step"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="guide__num-wrap">
                    <span className="guide__num">{step.n}</span>
                    {i < steps.length - 1 && <div className="guide__line" />}
                  </div>
                  <div className="guide__body">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                    {step.copy && (
                      <motion.button
                        className="btn btn--sm"
                        onClick={handleCopy}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {copied ? (
                          <><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3 3 7-7"/></svg> Copied!</>
                        ) : (
                          <><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M3 11V3a1.5 1.5 0 011.5-1.5H11"/></svg> Copy server location</>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── FAQ ── */}
        <section id="faq" className="sect">
          <div className="sect__inner sect__inner--narrow">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.span className="sect__tag" variants={blurIn} custom={0}>Common questions</motion.span>
              <motion.h2 className="sect__h2" variants={blurIn} custom={1}>FAQ</motion.h2>
            </motion.div>
            <div className="faq">
              {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} index={i} />)}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── CONTACT ── */}
        <section id="contact" className="sect sect--alt">
          <div className="sect__inner sect__inner--narrow">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.span className="sect__tag" variants={blurIn} custom={0}>Questions?</motion.span>
              <motion.h2 className="sect__h2" variants={blurIn} custom={1}>Get In Touch</motion.h2>
            </motion.div>

            <motion.form
              className="form"
              onSubmit={handleContactForm}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {/* Honeypot */}
              <div className="form__hp">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <motion.div className="form__field" variants={fadeUp}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required placeholder="your@email.com" />
              </motion.div>
              <motion.div className="form__field" variants={fadeUp}>
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" type="text" required placeholder="What's this about?" />
              </motion.div>
              <motion.div className="form__field" variants={fadeUp}>
                <label htmlFor="question">Message</label>
                <textarea id="question" name="question" rows={5} required placeholder="Your question..." />
              </motion.div>
              {formStatus === "error" && (
                <p className="form__error">Something went wrong. Please try again or email us directly.</p>
              )}
              <motion.div variants={fadeUp}>
                <motion.button
                  type="submit"
                  className="btn btn--prime btn--full"
                  disabled={formStatus === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {formStatus === "sent" ? (
                    <><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3 3 7-7"/></svg> Sent! We'll reply soon.</>
                  ) : formStatus === "sending" ? "Sending..." : formStatus === "error" ? "Failed — Try Again" : "Send Message"}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </section>

        </main>

        {/* ── FOOTER ── */}
        <footer className="ftr">
          <div className="ftr__inner">
            <div className="ftr__left">
              <div className="hdr__mark" style={{ width: 28, height: 28 }}>
                <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
                  <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M12 8L17 11V15L12 18L7 15V11L12 8Z" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
              <span className="ftr__name">PassivePips</span>
            </div>
            <div className="ftr__links">
              <span className="ftr__disclaimer">Trading forex carries risk. Past performance does not guarantee future results.</span>
            </div>
            <span className="ftr__copy">&copy; {new Date().getFullYear()} PassivePips. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </>
  );
}
