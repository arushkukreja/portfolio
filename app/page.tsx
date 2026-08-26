const metrics = [
  { value: "60%", label: "reduction in unauthorized transactions" },
  { value: "$2.5M", label: "cost savings from fraud strategies" },
  { value: "40%", label: "reduction in login friction" },
  { value: "3rd / 180+", label: "RBC Agentic AI Showcase" },
];

const experience = [
  {
    period: "2024 - Present",
    role: "Fraud Strategy Lead",
    focus: "Fraud Controls & Surveillance",
    company: "City National Bank (RBC)",
    summary:
      "Leading fraud controls across wires, ACH, Zelle, and non-monetary activity—turning emerging risk signals into scalable strategies, monitoring systems, and operating workflows.",
    highlights: [
      "Reduced unauthorized transactions by 60% while protecting the legitimate-client experience.",
      "Built a behavioral case-review framework that improved investigation efficiency by 60%.",
      "Created a Snowflake and Tableau reporting system that became the source of truth across Strategy, Operations, and Compliance.",
      "Built an AI-assisted investigation concept that placed 3rd among 180+ RBC enterprise teams.",
    ],
  },
  {
    period: "2022 - 2024",
    role: "Lead & Senior Data Science",
    focus: "Fraud Authentication",
    company: "Discover Financial Services",
    summary:
      "Designed authentication strategies that balanced account-takeover prevention with customer access, using SQL, behavioral segmentation, case review, and decision-tree analysis.",
    highlights: [
      "Reduced login friction by 40% and monthly service-call volume by 20%.",
      "Contributed $2.5M in savings through data-driven fraud prevention tactics.",
      "Built entity profiles, automated lookup lists, and Tableau reporting that reduced recurring work by more than eight hours.",
      "Mentored analysts and cut strategy-development time by 25%.",
    ],
  },
];

const capabilities = [
  "Fraud strategy",
  "Payments risk",
  "Advanced SQL",
  "Behavioral analytics",
  "Product strategy",
  "AI automation",
  "Risk decisioning",
  "Cross-functional execution",
];

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arush Kukreja",
    url: "https://www.linkedin.com/in/arushkukreja",
    jobTitle: "Fraud Strategy Lead",
    sameAs: ["https://www.linkedin.com/in/arushkukreja", "https://stockee.co"],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "George Mason University" },
      { "@type": "CollegeOrUniversity", name: "Virginia Tech" },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <header className="site-header shell">
          <a className="monogram" href="#top" aria-label="Arush Kukreja, home">
            AK<span>.</span>
          </a>
          <nav className="nav" aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
          </nav>
          <a className="header-link" href="mailto:arushkukrejaa@gmail.com">
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className="hero-content shell">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Fraud strategy · Product · Applied AI</p>
            <h1>
              I build systems that spot risk early<span>—</span>and products that make complexity disappear.
            </h1>
            <p className="hero-intro">
              I&apos;m Arush, a fraud strategist and hands-on product builder. I turn ambiguous signals into scalable controls, intelligent workflows, and useful software.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work</a>
              <a className="button button-ghost" href="/Arush-Kukreja-Resume.pdf" download>
                Download résumé
              </a>
            </div>
          </div>

          <div className="signal-panel" aria-label="Selected impact metrics">
            <div className="panel-topline">
              <span className="pulse" />
              <span>SELECTED SIGNALS</span>
              <span>LIVE</span>
            </div>
            <div className="metric-grid">
              {metrics.map((metric) => (
                <div className="metric" key={metric.value}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
            <div className="signal-line" aria-hidden="true">
              {[18, 29, 24, 42, 38, 61, 54, 78, 70, 89, 82, 96].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="hero-footer shell">
          <span>Based in Ashburn, Virginia</span>
          <span>Scroll to see the systems behind the numbers ↓</span>
        </div>
      </section>

      <section className="statement shell" id="about">
        <p className="section-label">What I do</p>
        <div className="statement-grid">
          <h2>Strategy when the stakes are high. Products when the path is unclear.</h2>
          <div>
            <p>
              My work sits at the intersection of risk, data, and product. In financial services, I design controls that protect customers without creating unnecessary friction. Outside work, I ship products that make financial information easier to understand and act on.
            </p>
            <a className="text-link" href="https://www.linkedin.com/in/arushkukreja" target="_blank" rel="noreferrer">
              More on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="section-label">Professional experience</p>
              <h2>Building trust into financial products.</h2>
            </div>
            <p>5+ years across fraud strategy, authentication, analytics, and scaled controls.</p>
          </div>

          <div className="experience-list">
            {experience.map((item, index) => (
              <article className="experience-card" key={item.company}>
                <div className="experience-index">0{index + 1}</div>
                <div className="experience-title">
                  <p>{item.period}</p>
                  <h3>{item.role}</h3>
                  <span>{item.focus}</span>
                  <strong>{item.company}</strong>
                </div>
                <div className="experience-copy">
                  <p>{item.summary}</p>
                  <ul>
                    {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-section shell" id="projects">
        <div className="section-heading projects-heading">
          <div>
            <p className="section-label">Independent products</p>
            <h2>I don&apos;t just recommend systems. I ship them.</h2>
          </div>
          <p>Two end-to-end financial products, built from problem framing through launch.</p>
        </div>

        <article className="project-card finesse-card">
          <div className="project-copy">
            <div className="project-meta">
              <span className="status-dot" /> Live on iOS
            </div>
            <p className="project-number">01 / FINTECH</p>
            <h3>Finesse Finance</h3>
            <p className="project-tagline">Your finances, quietly monitored.</p>
            <p>
              Finesse connects accounts through Plaid, learns each user&apos;s spending patterns, and proactively surfaces anomalies—so people can understand what is happening across their finances without reviewing every transaction themselves.
            </p>
            <div className="feature-row">
              <span>Behavioral baselines</span><span>10 insight types</span><span>Custom rules engine</span><span>Real-time webhooks</span>
            </div>
          </div>
          <div className="phone-stage" aria-label="Stylized Finesse Finance interface preview">
            <div className="phone">
              <div className="phone-bar"><span>9:41</span><i /></div>
              <div className="phone-content">
                <div className="phone-greeting"><span>Good morning</span><strong>Your money, in focus.</strong></div>
                <div className="balance-card">
                  <span>Across all accounts</span>
                  <strong>$24,860<span>.42</span></strong>
                  <small>↑ 4.8% this month</small>
                </div>
                <div className="insight-title"><strong>Finesse noticed</strong><span>See all</span></div>
                <div className="insight-card alert"><i>!</i><div><strong>Dining spend is trending up</strong><span>38% above your usual pace</span></div></div>
                <div className="insight-card"><i>✓</i><div><strong>Subscription change</strong><span>Your streaming bill dropped by $7</span></div></div>
              </div>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
          </div>
        </article>

        <article className="project-card stockee-card">
          <div className="stockee-visual" aria-label="Stylized Stockee market intelligence interface preview">
            <div className="terminal-top"><span>STOCKEE / MARKET SIGNAL</span><span>● LIVE</span></div>
            <div className="ticker-row"><strong>NVDA</strong><span>$181.12</span><em>+2.84%</em></div>
            <div className="chart" aria-hidden="true">
              <div className="chart-grid" />
              <div className="chart-bars">{[36, 47, 42, 58, 51, 64, 71, 67, 79, 88, 83, 96].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
            </div>
            <div className="terminal-insight">
              <span>WHY IT MATTERS</span>
              <p>Institutional ownership rose while earnings expectations moved higher. Here&apos;s the signal behind the conversation.</p>
            </div>
            <div className="source-strip"><span>SEC 13F</span><span>EARNINGS</span><span>POLYMARKET</span><span>REDDIT</span></div>
          </div>
          <div className="project-copy">
            <div className="project-meta"><span className="status-dot" /> Live web product</div>
            <p className="project-number">02 / AI + FINANCE</p>
            <h3>Stockee.co</h3>
            <p className="project-tagline">The market, translated.</p>
            <p>
              Stockee closes the knowledge gap for newer investors by combining earnings, fundamentals, SEC filings, institutional holdings, congressional trades, prediction markets, YouTube, and Reddit—then using AI to explain what the signals mean and why they matter.
            </p>
            <div className="feature-row"><span>Automated pipelines</span><span>Conditional Gemini workflows</span><span>Stripe</span><span>Plaid</span></div>
            <a className="project-link" href="https://stockee.co" target="_blank" rel="noreferrer">Visit Stockee.co <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </section>

      <section className="capabilities-section">
        <div className="shell capabilities-grid">
          <div>
            <p className="section-label">Capabilities</p>
            <h2>Built to connect the dots.</h2>
          </div>
          <div className="capability-list">
            {capabilities.map((capability, index) => (
              <div key={capability}><span>0{index + 1}</span>{capability}</div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-content">
          <p className="section-label">Start a conversation</p>
          <h2>Have a hard problem at the intersection of risk, data, and product?</h2>
          <a className="email-link" href="mailto:arushkukrejaa@gmail.com">arushkukrejaa@gmail.com <span aria-hidden="true">↗</span></a>
          <div className="footer-bottom">
            <span>Arush Kukreja © 2026</span>
            <div><a href="https://www.linkedin.com/in/arushkukreja" target="_blank" rel="noreferrer">LinkedIn</a><a href="/Arush-Kukreja-Resume.pdf" download>Résumé</a><a href="#top">Back to top ↑</a></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
