import { useState, useEffect, useRef } from "react";

const PORTFOLIO_DATA = {
  name: "Todd Bruschwein",
  title: "Revenue Operations & Analytics Leader",
  tagline: "Powering GTM teams with systems and analytics.",
  headshot: "/headshot.jpg", // Replace with: "/headshot.jpg" after adding image to /public folder
  about: [
    "I've spent 13+ years building the GTM infrastructure & strategy powering revenue teams — forecasting, dashboards, CRM architecture, KPI frameworks. First at Tesla during the Model S and Model 3 era, then at Lucid as one of the earliest Sales hires, scaling systems, analytics, and planning from zero through IPO and $600M+.",
    "Currently based in Oakland, exploring what AI automation can do for revenue operations.",
  ],
  projects: [
    {
      title: "📡 Alpha Scanner",
      hero: "/alpha-scanner-hero.jpg",
      tags: ["Python", "Alpaca API", "GitHub Actions", "SQLite", "Streamlit"],
      description:
        "An automated momentum trading system. Scores 180+ tickers daily against a 7-indicator signal and autonomously executes entries, exits, and stops on Alpaca.",
      metrics: [
        { value: "180+", label: "Tickers scored daily" },
        { value: "Fully automated", label: "Entry, exit & stops" },
        { value: "Sharpe 3.16", label: "Backtested strategy" },
      ],
      status: "Live",
      details: {
        problem: "Over the past 2 years, I watched AI infrastructure stocks break out in sequence — GPUs, then networking, then memory, then power. Each wave was visible in hindsight but hard to catch in real time. A watchlist of 180+ tickers across 31 subsectors is too much to monitor manually — and even a good signal is worthless if execution still depends on me staring at a screen.",
        approach: "Scores 180+ tickers daily against a 7-indicator momentum signal (chosen from 16 candidates via 3-year backtesting), then trades autonomously on Alpaca via GitHub Actions. The daily pipeline evaluates exits, filters new entries through a 3-day persistence rule, submits 3%-buffered limit orders with a 5% cash reserve, and attaches GTC stops at entry × 0.80. Every parameter — entry threshold, stop loss, max positions, order type — was chosen by backtest sweep.",
        results: "The live config — Limit-3% orders + 5% cash floor + 20% stops — produced Sharpe 3.16, Sortino 4.88, and zero negative-cash days across a 4-way entry-mode backtest. Now running live on Alpaca with active positions protected by GTC stops. Every parameter was calibrated from backtest sweeps.",
        links: { github: "https://github.com/t0ddb/alpha-scanner", demo: "https://alphascanner.streamlit.app/" },
      },
    },
    {
      title: "🎯 Job Matcher Pipeline",
      hero: "/job-matcher-hero.jpg",
      tags: ["Python", "Claude API", "GitHub Actions", "REST APIs"],
      description:
        "An automated daily pipeline that searches multiple job APIs, scores listings against my profile using Claude AI, and delivers a curated email digest every morning.",
      metrics: [
        { value: "3", label: "API sources" },
        { value: "Claude-scored", label: "Daily matches" },
        { value: "~$1/mo", label: "Infrastructure cost" },
      ],
      status: "Completed",
      details: {
        problem: "Job searching across multiple boards is repetitive and time-consuming. Most listings aren't relevant, and the good ones get buried. I needed a system that would surface high-fit roles automatically, every day, without me logging into five different sites.",
        approach: "Built a Python pipeline that fetches listings from three sources (Adzuna, Himalayas, RemoteOK), deduplicates against a rolling 7-day cache, then sends each new listing to Claude Haiku for AI scoring against a detailed candidate profile and rubric. Jobs scoring 5+ out of 10 are compiled into an HTML email digest, split by Bay Area and Remote.",
        results: "Runs daily at 7am PT via GitHub Actions. The scoring rubric rewards CRM architecture, data infrastructure, 0-to-1 builds, and Director+ scope — and penalizes mismatches like pure people management or IC-level roles. Surfaces 5–15 relevant listings per day from hundreds of raw results.",
        links: { github: "https://github.com/t0ddb/job-matcher" },
      },
    },
    {
      title: "🏔️ Powder Hound",
      hero: "/powder-hound-hero.jpg",
      tags: ["Python", "Flask", "Leaflet.js", "Open-Meteo API", "Replit"],
      description:
        "A real-time snow forecast tracker for Western US ski resorts. Ranks resorts by expected snowfall and plots them on an interactive map with color-coded powder alerts.",
      metrics: [
        { value: "~40", label: "Resorts tracked" },
        { value: "7-day", label: "Forecast horizon" },
        { value: "1 hour", label: "Build time" },
      ],
      status: "Completed",
      details: {
        problem: "Every skier asks the same question on a Wednesday: where's it going to dump this weekend? Most weather sites make you check resorts one by one. I wanted a single view that answered it instantly.",
        approach: "Built a Flask app on Replit that pulls 7-day snow forecasts from the Open-Meteo API for ~40 hardcoded Western US resorts. Markers on a Leaflet.js map are color-coded and scaled by snowfall intensity (light snow through powder alert). A sidebar ranks resorts by forecasted snowfall and base depth, with regional filters for Rockies, Northwest, Tahoe, and Southwest.",
        results: "A live dashboard that answers 'where should I ski this weekend?' in 5 seconds. Built the whole thing in about an hour with Replit — something that would have required a developer and a lot more patience just two years ago.",
        links: { demo: "https://powder-hound--t0ddb.replit.app/" },
      },
    },
  ],
  skills: {
    "GTM Strategy & Operations": ["Revenue Forecasting", "Pipeline Analytics", "KPI Frameworks", "Funnel Optimization", "Territory & Headcount Planning", "Sales Compensation Design"],
    "Systems & CRM": ["Salesforce (Sales & Service Cloud)", "Object Model & CRM Architecture", "Data Governance", "Reporting Frameworks", "Roadmap Prioritization"],
    "Analytics & Intelligence": ["Tableau", "Excel & SQL", "AWS Redshift", "Data Modeling", "AI Automation", "Airflow & ETL"],
    "Leadership": ["Team Development (up to 14)", "CEO & Board-Level Reporting", "QBR / WBR Cadence", "Cross-Functional Partnership", "Strategic Planning"],
  },
  contact: {
    github: "github.com/t0ddb",
    linkedin: "linkedin.com/in/toddbruschwein",
  },
};

// --- Theme colors ---
const T = {
  bg: "#f4f2ee",            // LinkedIn background
  cardBg: "#ffffff",
  surface: "#eae7e1",
  text: "#191919",          // LinkedIn text black
  muted: "#56687a",
  faint: "#94a0b8",
  accent: "#0a66c2",        // LinkedIn blue
  accentLight: "rgba(10,102,194,0.08)",
  accentMid: "rgba(10,102,194,0.15)",
  accentBorder: "rgba(10,102,194,0.25)",
  warm: "#b8923e",          // gold tan
  warmLight: "rgba(184,146,62,0.1)",
  warmMid: "rgba(184,146,62,0.18)",
  warmBorder: "rgba(184,146,62,0.3)",
  border: "#e0dcd5",
  borderLight: "#eae7e1",
  blue: "#0a66c2",
  blueLight: "rgba(10,102,194,0.08)",
  amber: "#b8923e",
  amberLight: "rgba(184,146,62,0.08)",
  green: "#2d7a4b",                       // status = Live
  greenLight: "rgba(45,122,75,0.1)",
};

const GridBackground = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      background: `
        radial-gradient(ellipse 60% 40% at 50% 50%, rgba(184,146,62,0.025), transparent),
        #f4f2ee
      `,
    }}
  >
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1400 800" style={{ position: "absolute", inset: 0 }}>
      <g>
        {/* Bottom — wide spacing, thick, full gold */}
        <line x1="0" y1="775" x2="1400" y2="775" stroke="#b8923e" strokeWidth="3.75" opacity="0.495"/>
        <line x1="0" y1="754" x2="1400" y2="754" stroke="#b8923e" strokeWidth="3.375" opacity="0.428"/>
        <line x1="0" y1="735" x2="1400" y2="735" stroke="#b8923e" strokeWidth="3.0" opacity="0.372"/>
        <line x1="0" y1="718" x2="1400" y2="718" stroke="#b8923e" strokeWidth="2.625" opacity="0.315"/>
        {/* Middle — spacing compressing, fading toward background */}
        <line x1="0" y1="703" x2="1400" y2="703" stroke="#c4a35e" strokeWidth="2.25" opacity="0.27"/>
        <line x1="0" y1="690" x2="1400" y2="690" stroke="#c9ab6a" strokeWidth="1.875" opacity="0.225"/>
        <line x1="0" y1="679" x2="1400" y2="679" stroke="#ceb376" strokeWidth="1.69" opacity="0.192"/>
        <line x1="0" y1="670" x2="1400" y2="670" stroke="#d3ba82" strokeWidth="1.5" opacity="0.158"/>
        {/* Top — tight spacing, thin, washed out */}
        <line x1="0" y1="663" x2="1400" y2="663" stroke="#d8c28e" strokeWidth="1.31" opacity="0.131"/>
        <line x1="0" y1="657" x2="1400" y2="657" stroke="#dcca9a" strokeWidth="1.125" opacity="0.104"/>
        <line x1="0" y1="652" x2="1400" y2="652" stroke="#e0d0a6" strokeWidth="0.94" opacity="0.081"/>
        <line x1="0" y1="648" x2="1400" y2="648" stroke="#e4d6b0" strokeWidth="0.84" opacity="0.063"/>
        <line x1="0" y1="645" x2="1400" y2="645" stroke="#e8dcba" strokeWidth="0.75" opacity="0.05"/>
        <line x1="0" y1="643" x2="1400" y2="643" stroke="#ebe0c2" strokeWidth="0.66" opacity="0.041"/>
        <line x1="0" y1="641" x2="1400" y2="641" stroke="#eee4ca" strokeWidth="0.56" opacity="0.035"/>
        <line x1="0" y1="639" x2="1400" y2="639" stroke="#efe6ce" strokeWidth="0.49" opacity="0.03"/>
        <line x1="0" y1="636" x2="1400" y2="636" stroke="#f0e8d2" strokeWidth="0.425" opacity="0.026"/>
        <line x1="0" y1="633" x2="1400" y2="633" stroke="#f1ead5" strokeWidth="0.375" opacity="0.023"/>
        <line x1="0" y1="629" x2="1400" y2="629" stroke="#f2ebd8" strokeWidth="0.325" opacity="0.02"/>
        <line x1="0" y1="625" x2="1400" y2="625" stroke="#f3eddb" strokeWidth="0.29" opacity="0.017"/>
        <line x1="0" y1="621" x2="1400" y2="621" stroke="#f4eede" strokeWidth="0.25" opacity="0.014"/>
      </g>
    </svg>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    Completed: { bg: T.warmLight, text: T.warm, dot: T.warm },
    "In Progress": { bg: T.blueLight, text: T.blue, dot: T.blue },
    Live: { bg: T.greenLight, text: T.green, dot: T.green },
    Planned: { bg: T.amberLight, text: T.faint, dot: T.faint },
  };
  const c = colors[status] || colors.Planned;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 20,
        background: c.bg,
        color: c.text,
        fontSize: 12,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.04em",
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          animation: status === "In Progress" || status === "Live" ? "pulse 2s ease-in-out infinite" : "none",
        }}
      />
      {status}
    </span>
  );
};

const Tag = ({ label }) => (
  <span
    style={{
      padding: "3px 10px",
      borderRadius: 6,
      background: T.surface,
      border: `1px solid ${T.border}`,
      color: T.muted,
      fontSize: 12,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.02em",
    }}
  >
    {label}
  </span>
);

const SectionLabel = ({ children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 2,
        background: T.accent,
      }}
    />
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: T.accent,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  </div>
);

const DetailLabel = ({ children }) => (
  <span
    style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: T.accent,
      fontWeight: 500,
      display: "block",
      marginBottom: 6,
    }}
  >
    {children}
  </span>
);

const ProjectCard = ({ proj, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [heroPanProgress, setHeroPanProgress] = useState(0);
  // heroPanScale normalizes pan speed across images with different aspect ratios.
  // Without it, wider images pan several times faster than near-square ones because
  // `background-position: 100%` is 100% of whatever overflow the image has after `cover`.
  // With it, every card pans ~TARGET_PAN_PX of visible image movement across the full
  // scroll range, so motion feels consistent regardless of the hero's aspect ratio.
  const [heroPanScale, setHeroPanScale] = useState(1);
  const cardRef = useRef(null);
  const heroElemRef = useRef(null);
  const hasHero = Boolean(proj.hero);

  // Scroll-linked horizontal parallax for this card's hero image.
  // Panning doesn't start until the card's top edge crosses 50% of the viewport,
  // giving the viewer time to orient as the card enters from the bottom.
  // Panning completes by the time the card has fully exited off the top.
  useEffect(() => {
    if (!hasHero) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId = null;
    const update = () => {
      rafId = null;
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Progress starts when rect.top crosses vh/2 (card top at middle of screen)
      // and ends when rect.bottom crosses 0 (card has fully exited the top).
      // Scroll distance of the pan = (vh/2) + rect.height.
      const startRectTop = vh / 2;
      const endRectTop = -rect.height;
      const range = startRectTop - endRectTop; // = vh/2 + rect.height
      const current = startRectTop - rect.top;
      const p = Math.max(0, Math.min(1, current / range));
      setHeroPanProgress(p);
    };
    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [hasHero]);

  // Measure hero container and image to compute heroPanScale (see comment on the state).
  // Target: ~55px of visible image movement per card, regardless of image aspect ratio —
  // calibrated to feel like the original Job Matcher pan speed.
  useEffect(() => {
    if (!hasHero) return;
    const TARGET_PAN_PX = 70;

    const img = new Image();
    img.src = proj.hero;

    let rafId = null;
    const measure = () => {
      rafId = null;
      const el = heroElemRef.current;
      if (!el || !img.complete || !img.naturalWidth || !img.naturalHeight) return;
      const cw = el.offsetWidth;
      const ch = el.offsetHeight;
      if (!cw || !ch) return;
      // Simulate `background-size: cover`: image is scaled so the container is fully covered.
      const coverScale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const renderedW = img.naturalWidth * coverScale;
      const overflowPx = renderedW - cw;
      if (overflowPx <= 0) {
        setHeroPanScale(0); // no horizontal overflow — can't pan
      } else {
        setHeroPanScale(Math.min(1, TARGET_PAN_PX / overflowPx));
      }
    };
    const onChange = () => {
      if (rafId == null) rafId = requestAnimationFrame(measure);
    };

    img.onload = onChange;
    if (img.complete) onChange();
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("resize", onChange);
      if (rafId != null) cancelAnimationFrame(rafId);
      img.onload = null;
    };
  }, [hasHero, proj.hero]);

  const Header = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 20,
          fontWeight: 600,
          color: T.text,
          letterSpacing: "-0.01em",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {proj.title}
        <span
          className="details-pill"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 10px",
            borderRadius: 6,
            background: T.surface,
            border: `1px solid ${T.border}`,
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
            color: T.faint,
            transition: "all 0.25s ease",
            flexShrink: 0,
          }}
        >
          {expanded ? "Less ↑" : "Details ↓"}
        </span>
      </h3>
      <StatusBadge status={proj.status} />
    </div>
  );

  const Description = () => (
    <p
      style={{
        fontSize: 15,
        lineHeight: 1.7,
        color: T.muted,
        fontWeight: 400,
        marginBottom: proj.metrics ? 20 : 18,
      }}
    >
      {proj.description}
    </p>
  );

  const Metrics = () =>
    proj.metrics ? (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, marginBottom: 22 }}>
        {proj.metrics.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: T.text,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: T.faint,
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>
    ) : null;

  const Footer = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      {proj.details?.links?.github && (
        <a
          href={proj.details.links.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.04em",
            padding: "3px 12px",
            borderRadius: 6,
            background: T.accentLight,
            border: `1px solid ${T.accentBorder}`,
            color: T.accent,
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = T.accentMid;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = T.accentLight;
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
      )}
      {proj.details?.links?.demo && (
        <a
          href={proj.details.links.demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.04em",
            padding: "3px 12px",
            borderRadius: 6,
            background: T.warmLight,
            border: `1px solid ${T.warmBorder}`,
            color: T.warm,
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = T.warmMid;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = T.warmLight;
          }}
        >
          Live Demo →
        </a>
      )}
      {(proj.details?.links?.github || proj.details?.links?.demo) && (
        <div style={{ width: 1, height: 18, background: T.border, flexShrink: 0 }} />
      )}
      {proj.tags.map((t) => (
        <Tag key={t} label={t} />
      ))}
    </div>
  );

  const Expandable = () => (
    <div
      style={{
        overflow: "hidden",
        maxHeight: expanded ? 1200 : 0,
        opacity: expanded ? 1 : 0,
        transition: "max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
      }}
    >
      <div
        style={{
          paddingTop: 24,
          marginTop: 20,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          {proj.details?.problem && (
            <div>
              <DetailLabel>The Problem</DetailLabel>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: T.muted, fontWeight: 400 }}>
                {proj.details.problem}
              </p>
            </div>
          )}
          {proj.details?.approach && (
            <div>
              <DetailLabel>Approach</DetailLabel>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: T.muted, fontWeight: 400 }}>
                {proj.details.approach}
              </p>
            </div>
          )}
          {proj.details?.results && (
            <div>
              <DetailLabel>Results</DetailLabel>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: T.muted, fontWeight: 400 }}>
                {proj.details.results}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- Hero image layout (left image, right content) ---
  if (hasHero) {
    return (
      <div
        ref={cardRef}
        className="project-card project-card--with-hero"
        onClick={() => setExpanded(!expanded)}
        style={{
          borderRadius: 12,
          background: T.cardBg,
          border: `1px solid ${expanded ? T.accentBorder : T.border}`,
          cursor: "pointer",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
        }}
      >
        <div
          className="project-card__inner"
          style={{
            display: "grid",
            gridTemplateColumns: "42% 1fr",
            minHeight: 340,
          }}
        >
          <div
            ref={heroElemRef}
            className="project-card__hero"
            style={{
              backgroundImage: `url(${proj.hero})`,
              backgroundSize: "cover",
              backgroundPosition: `${(heroPanProgress * heroPanScale * 100).toFixed(2)}% top`,
              backgroundColor: "#0a0f1c",
              borderRight: `1px solid ${T.border}`,
            }}
          />
          <div
            className="project-card__body"
            style={{
              padding: "28px 32px 24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Header />
            <Description />
            <Metrics />
            <div style={{ marginTop: "auto" }}>
              <Footer />
            </div>
          </div>
        </div>
        <div style={{ padding: "0 32px 24px" }}>
          <Expandable />
        </div>
      </div>
    );
  }

  // --- Text-only fallback ---
  return (
    <div
      className="project-card"
      onClick={() => setExpanded(!expanded)}
      style={{
        padding: 28,
        borderRadius: 12,
        background: T.cardBg,
        border: `1px solid ${expanded ? T.accentBorder : T.border}`,
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Header />
      <Description />
      <Metrics />
      <Footer />
      <Expandable />
    </div>
  );
};

const NavDot = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "6px 0",
      transition: "all 0.3s ease",
    }}
  >
    <span
      style={{
        width: active ? 10 : 6,
        height: active ? 10 : 6,
        borderRadius: "50%",
        background: active ? T.accent : "#d0d4e0",
        transition: "all 0.3s ease",
      }}
    />
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: active ? T.accent : T.faint,
        transition: "all 0.3s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  </button>
);

const HeadshotPlaceholder = () => (
  <div
    style={{
      width: 210,
      height: 210,
      borderRadius: 12,
      background: T.surface,
      border: `1px solid ${T.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={T.faint} strokeWidth="1.2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" />
    </svg>
  </div>
);

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");
  const [loaded, setLoaded] = useState(false);

  const sectionRefs = {
    hero: useRef(null),
    about: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const d = PORTFOLIO_DATA;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .project-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }
        .project-card:hover {
          transform: translateY(-4px);
          border-color: rgba(10,102,194,0.25) !important;
          box-shadow: 0 8px 40px rgba(10,102,194,0.06);
        }

        .project-card:hover .details-pill {
          background: rgba(10,102,194,0.08) !important;
          border-color: rgba(10,102,194,0.25) !important;
          color: #0a66c2 !important;
          transform: translateY(1px);
        }

        .skill-group {
          transition: all 0.3s ease;
        }
        .skill-group:hover {
          border-color: rgba(10,102,194,0.25) !important;
          background: rgba(10,102,194,0.04) !important;
        }

        .contact-link {
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .contact-link:hover {
          color: #0a66c2 !important;
          border-color: rgba(10,102,194,0.25) !important;
          background: rgba(10,102,194,0.04) !important;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #dde0ea; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #c0c4d4; }

        @media (max-width: 768px) {
          .side-nav {
            display: none !important;
          }
          .main-content {
            padding: 0 20px !important;
          }
          .hero-section {
            min-height: 80vh !important;
            padding-top: 60px !important;
          }
          .headshot-row {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 24px !important;
          }
          .headshot-row img {
            width: 160px !important;
            height: 160px !important;
          }
          .logo-bar {
            max-width: 100% !important;
          }
          .about-buttons {
            justify-content: center !important;
          }
          .about-buttons a {
            flex: 1 !important;
            width: auto !important;
          }
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-links {
            max-width: 100% !important;
          }
          .project-card--with-hero .project-card__inner {
            grid-template-columns: 1fr !important;
            min-height: 0 !important;
          }
          .project-card--with-hero .project-card__hero {
            aspect-ratio: 16 / 9 !important;
            border-right: none !important;
            border-bottom: 1px solid #e0dcd5 !important;
          }
          .project-card--with-hero .project-card__body {
            padding: 24px 22px !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          color: T.text,
          fontFamily: "'Outfit', sans-serif",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <GridBackground />

        {/* Side Nav */}
        <nav
          className="side-nav"
          style={{
            position: "fixed",
            left: 28,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          {["hero", "about", "projects", "skills", "contact"].map((s) => (
            <NavDot
              key={s}
              label={s === "hero" ? "home" : s}
              active={activeSection === s}
              onClick={() => scrollTo(s)}
            />
          ))}
        </nav>

        {/* Main Content */}
        <main className="main-content" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 0 140px", position: "relative", zIndex: 1 }}>
          {/* Hero */}
          <section
            id="hero"
            ref={sectionRefs.hero}
            className="hero-section"
            style={{
              minHeight: "calc(100vh - 70px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: 0,
            }}
          >
            <div className="fade-up" style={{ animationDelay: "0.2s" }}>
              <SectionLabel>Portfolio</SectionLabel>
            </div>
            <h1
              className="fade-up"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(42px, 6vw, 72px)",
                fontWeight: 700,
                lineHeight: 1.05,
                color: T.text,
                marginBottom: 20,
                animationDelay: "0.35s",
                letterSpacing: "-0.03em",
              }}
            >
              {d.name}
              <span style={{ color: T.accent }}>.</span>
            </h1>
            <p
              className="fade-up"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(14px, 2vw, 17px)",
                color: T.faint,
                fontWeight: 400,
                letterSpacing: "0.02em",
                marginBottom: 12,
                animationDelay: "0.5s",
              }}
            >
              {d.title}
            </p>
            <p
              className="fade-up"
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                color: "#4a5068",
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: 560,
                animationDelay: "0.65s",
              }}
            >
              {d.tagline}
            </p>
            <div
              className="fade-up"
              style={{
                marginTop: 40,
                display: "flex",
                gap: 16,
                animationDelay: "0.8s",
              }}
            >
              <button
                onClick={() => scrollTo("projects")}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.06em",
                  padding: "12px 28px",
                  background: T.accentLight,
                  border: `1px solid ${T.accentBorder}`,
                  color: T.accent,
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = T.accentMid;
                  e.target.style.boxShadow = "0 4px 20px rgba(10,102,194,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = T.accentLight;
                  e.target.style.boxShadow = "none";
                }}
              >
                VIEW PROJECTS
              </button>
              <button
                onClick={() => scrollTo("contact")}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.06em",
                  padding: "12px 28px",
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  color: T.muted,
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#c0c4d4";
                  e.target.style.color = T.text;
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = T.border;
                  e.target.style.color = T.muted;
                }}
              >
                CONTACT
              </button>
            </div>
          </section>

          {/* About */}
          <section
            id="about"
            ref={sectionRefs.about}
            style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 0" }}
          >
            <SectionLabel>About</SectionLabel>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32,
                fontWeight: 600,
                color: T.text,
                marginBottom: 28,
                letterSpacing: "-0.02em",
              }}
            >
              Background
            </h2>

            {/* Headshot + Bio row */}
            <div className="headshot-row" style={{ display: "flex", gap: 32, alignItems: "flex-start", maxWidth: 700 }}>
              {d.headshot ? (
                <img
                  src={d.headshot}
                  alt="Headshot"
                  style={{
                    width: 210,
                    height: 210,
                    borderRadius: 12,
                    objectFit: "cover",
                    flexShrink: 0,
                    border: `1px solid ${T.border}`,
                  }}
                />
              ) : (
                <HeadshotPlaceholder />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {d.about.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: 16,
                      lineHeight: 1.75,
                      color: T.muted,
                      fontWeight: 400,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Logo Bar */}
            <div style={{ marginTop: 36, marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: T.faint,
                  fontWeight: 400,
                  display: "block",
                  marginBottom: 18,
                }}
              >
                Experience
              </span>
              <div
                className="logo-bar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  maxWidth: 700,
                }}
              >
                {/* Tesla */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.85,
                    transition: "opacity 0.25s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
                >
                  <img
                    src="/tesla-logo.png"
                    alt="Tesla"
                    style={{
                      width: "70%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="logo-divider" style={{ width: 1, height: 40, background: T.border, flexShrink: 0 }} />

                {/* Lucid */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.85,
                    transition: "opacity 0.25s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
                >
                  <img
                    src="/lucid-logo.png"
                    alt="Lucid Motors"
                    style={{
                      width: "65%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div className="logo-divider" style={{ width: 1, height: 40, background: T.border, flexShrink: 0 }} />

                {/* Santa Clara University */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.85,
                    transition: "opacity 0.25s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
                >
                  <img
                    src="/scu-logo.png"
                    alt="Santa Clara University"
                    style={{
                      width: "70%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="about-buttons" style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <a
                href={`https://${d.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.06em",
                  padding: "12px 24px",
                  width: 180,
                  background: "rgba(0, 119, 181, 0.06)",
                  border: "1px solid rgba(0, 119, 181, 0.2)",
                  color: "#0077b5",
                  borderRadius: 8,
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 119, 181, 0.12)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,119,181,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 119, 181, 0.06)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LINKEDIN
              </a>
              <a
                href="https://github.com/t0ddb"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.06em",
                  padding: "12px 24px",
                  width: 180,
                  background: "rgba(36, 41, 46, 0.06)",
                  border: "1px solid rgba(36, 41, 46, 0.2)",
                  color: "#24292e",
                  borderRadius: 8,
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(36, 41, 46, 0.12)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(36,41,46,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(36, 41, 46, 0.06)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GITHUB
              </a>
            </div>
          </section>

          {/* Projects */}
          <section
            id="projects"
            ref={sectionRefs.projects}
            style={{ padding: "80px 0" }}
          >
            <SectionLabel>Projects</SectionLabel>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32,
                fontWeight: 600,
                color: T.text,
                marginBottom: 36,
                letterSpacing: "-0.02em",
              }}
            >
              What I'm Building
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {d.projects.map((proj, i) => (
                <ProjectCard key={i} proj={proj} />
              ))}
            </div>
          </section>

          {/* Skills */}
          <section
            id="skills"
            ref={sectionRefs.skills}
            style={{ padding: "80px 0" }}
          >
            <SectionLabel>Skills</SectionLabel>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32,
                fontWeight: 600,
                color: T.text,
                marginBottom: 36,
                letterSpacing: "-0.02em",
              }}
            >
              Core Competencies
            </h2>
            <div
              className="skills-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {Object.entries(d.skills).map(([category, items]) => (
                <div
                  key={category}
                  className="skill-group"
                  style={{
                    padding: 22,
                    borderRadius: 12,
                    background: T.cardBg,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: T.accent,
                      marginBottom: 14,
                      fontWeight: 500,
                    }}
                  >
                    {category}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.map((item) => (
                      <span
                        key={item}
                        style={{
                          fontSize: 14,
                          color: T.muted,
                          fontWeight: 400,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section
            id="contact"
            ref={sectionRefs.contact}
            style={{
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "80px 0 170px",
            }}
          >
            <SectionLabel>Contact</SectionLabel>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32,
                fontWeight: 600,
                color: T.text,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Let's Connect
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: T.muted,
                fontWeight: 400,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              I'd love to hear from you.
            </p>
            <div className="contact-links" style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
              {[
                { label: "LinkedIn", value: d.contact.linkedin, href: `https://${d.contact.linkedin}`, icon: "→" },
                { label: "GitHub", value: d.contact.github, href: `https://${d.contact.github}`, icon: "→" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                    background: T.cardBg,
                    color: T.muted,
                    fontSize: 14,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: T.faint,
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      {link.label}
                    </span>
                    <span style={{ fontWeight: 500, color: T.text }}>{link.value}</span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 300 }}>{link.icon}</span>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
