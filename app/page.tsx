import Image from "next/image";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AgentAccordion,
  ExperienceAccordion,
  WorkflowLibrary,
  type AgentItem,
  type ExperienceItem,
  type WorkflowItem,
} from "@/components/portfolio-accordions";
import { TypewriterText } from "@/components/typewriter-text";

const impact = [
  { value: "60%", label: "fewer unauthorized transactions" },
  { value: "$2.5M", label: "savings from fraud strategies" },
  { value: "40%", label: "less login friction" },
  { value: "3rd place", label: "RBC Agentic AI Showcase" },
];

const experience: ExperienceItem[] = [
  {
    period: "Feb 2024 — Present",
    role: "Fraud ATO Strategy Lead",
    focus: "Fraud controls · surveillance · applied AI",
    company: "City National Bank (RBC)",
    summary: "Leading fraud controls across wires, ACH, Zelle, and non-monetary activity—turning emerging risk signals into scalable strategies, monitoring systems, and operating workflows.",
    highlights: [
      "Reduced unauthorized transactions and customer friction by 60% through authentication redesign, real-time rule optimization, and stronger control enforcement.",
      "Built a behavioral case-review framework combining phone intelligence, risk signals, and historical fraud trends to improve investigation efficiency by 60%.",
      "Created centralized Snowflake and Tableau reporting for fraud KPIs, Reg E and UTR service levels, and executive performance visibility.",
      "Authored audit-ready procedures and playbooks that standardized fraud handling, regulatory documentation, and team training.",
      "Designed AI prototypes for conversational investigations, chat-with-data analytics, and self-serve regulatory and training guidance.",
      "Built an AI-assisted investigation concept that placed 3rd among 180+ RBC enterprise teams.",
    ],
    tools: ["Snowflake", "Tableau", "SQL", "ThreatMetrix", "RSA", "Pindrop", "Omilia"],
  },
  {
    period: "Apr 2023 — Feb 2024",
    role: "Lead Data Science Analyst",
    focus: "Fraud authentication · product strategy · analytics",
    company: "Discover Financial Services",
    summary: "Led authentication strategy and cross-functional product analysis for account access, balancing account-takeover prevention with a lower-friction customer experience.",
    highlights: [
      "Reduced login friction by 40% and monthly service-call volume by 20%.",
      "Translated fraud and customer signals into prioritized feature recommendations for Product and Engineering.",
      "Migrated and automated Tableau reporting, returning more than eight hours of capacity each week.",
      "Supported bank teams during active fraud attacks with entity profiles, automated lookup lists, and rapid analysis.",
      "Mentored analysts and cut strategy-development time by 25%.",
    ],
    tools: ["SQL", "Tableau", "Excel", "Jira", "Confluence"],
  },
  {
    period: "Dec 2021 — Apr 2023",
    role: "Senior Data Science Analyst",
    focus: "Fraud decisioning · experimentation · data products",
    company: "Discover Financial Services",
    summary: "Built and evaluated authentication strategies using SQL, decision trees, behavioral segmentation, and detailed case review to reduce fraud without adding unnecessary customer friction.",
    highlights: [
      "Contributed $2.5M in savings through data-driven fraud prevention strategies.",
      "Led more than 40 case reviews to identify emerging account-takeover patterns and control gaps.",
      "Built decision-tree models and reusable SQL pipelines to improve fraud capture and investigation speed.",
      "Replaced recurring manual reporting with automated dashboards and monitoring.",
      "Presented strategy recommendations to senior leaders and supported cross-functional implementations.",
    ],
    tools: ["SQL", "Python", "Tableau", "Excel"],
  },
  {
    period: "Jun 2021 — Dec 2021",
    role: "People Analytics Data Scientist Intern",
    focus: "Predictive modeling · people analytics",
    company: "Discover Financial Services",
    summary: "Supported the People Analytics modeling roadmap by translating workforce data into an early predictive use case for internal decision support.",
    highlights: [
      "Developed an odds-of-entry model using logistic regression, decision trees, and random forests.",
      "Analyzed complex workforce data and visualized findings with R, tidyverse, tidymodels, and ggplot2.",
      "Led compensation-grade analysis with Employee Relations and presented recommendations accepted for further implementation.",
      "Worked across business units in an Agile environment to improve reporting and decision support.",
    ],
    tools: ["R", "tidyverse", "tidymodels", "ggplot2"],
  },
  {
    period: "Aug 2021 — Dec 2021",
    role: "Data Scientist",
    focus: "Fraud modeling · product ownership · applied research",
    company: "Dovel Technologies",
    summary: "Completed a fraud analytics capstone focused on identifying risk indicators in marriage-based immigration filings while serving as the team’s product owner.",
    highlights: [
      "Designed machine-learning models to identify factors associated with potentially fraudulent filings.",
      "Gathered multi-source public data through web scraping and translated it into an analysis-ready dataset.",
      "Used Python, pandas, NumPy, matplotlib, R, and tidymodels to analyze and visualize fraud patterns.",
      "Managed delivery and team progress through YouTrack as the designated product owner.",
    ],
    tools: ["Python", "pandas", "NumPy", "matplotlib", "R", "tidymodels", "YouTrack"],
  },
  {
    period: "Sep 2020 — Feb 2021",
    role: "Web Design Assistant",
    focus: "Content systems · QA · web operations",
    company: "George Mason University",
    summary: "Supported the Schar School of Policy and Government’s content migration and website quality program across WordPress and Mason’s Drupal-based digital platform.",
    highlights: [
      "Configured and migrated web content using WordPress, Drupal, HTML, CSS, and image-editing tools.",
      "Performed user-acceptance, regression, and browser-compatibility testing before publication.",
      "Supported SEO and documented unexpected system behavior with reproducible evidence for resolution.",
    ],
    tools: ["WordPress", "Drupal", "HTML", "CSS"],
  },
  {
    period: "Oct 2019 — Jul 2020",
    role: "Business Data Analyst",
    focus: "Salesforce · business analysis · resource analytics",
    company: "West Coast Consulting",
    summary: "Supported a Salesforce customization initiative designed to manage consultants, improve resource utilization, and make operating data easier to act on.",
    highlights: [
      "Gathered business requirements and translated them into functional documentation, use cases, and interface specifications.",
      "Implemented Salesforce configurations, user profiles, and role structures.",
      "Analyzed historical utilization data to surface operational patterns and improve reporting.",
    ],
    tools: ["Salesforce", "Excel"],
  },
  {
    period: "Aug 2018 — Apr 2019",
    role: "Inventory Utilization Analyst",
    focus: "Process improvement · analytics · product delivery",
    company: "Eastman",
    summary: "Led a four-person capstone that combined 5S, process mapping, inventory analytics, and a lightweight decision tool to improve indirect-materials management.",
    highlights: [
      "Saved $45,000 in seven weeks and identified approximately $300,000 in projected opportunity.",
      "Extracted SAP data with SQL Server and built Excel models to identify demand and stock-out patterns.",
      "Mapped operating procedures with BPMN and synthesized requirements from leaders, planners, subject-matter experts, and field staff.",
      "Delivered an Excel-macro interface that prioritized inventory decisions after project handoff.",
    ],
    tools: ["SAP", "SQL Server", "Excel", "VBA", "BPMN"],
  },
  {
    period: "Jul 2018 — Aug 2018",
    role: "Supply Chain Analyst Intern",
    focus: "Inventory systems · Tableau · process design",
    company: "Ariel Corporation",
    summary: "Led an operational-improvement initiative for distribution-center rack organization, combining inventory evidence with a practical process redesign.",
    highlights: [
      "Used SAP and advanced Excel analysis to assess part usage and inventory-report accuracy.",
      "Built a Tableau dashboard to make inventory performance easier to monitor.",
      "Designed a poka-yoke workflow, drafted a new SOP, and presented recommendations to senior operations leadership.",
    ],
    tools: ["SAP", "Excel", "Tableau"],
  },
  {
    period: "Jul 2017 — Aug 2017",
    role: "Logistics Intern",
    focus: "Warehouse operations · quality · automation",
    company: "Agility",
    summary: "Worked across warehouse planning, inventory, quality, safety, customer service, and WMS reporting to understand and improve high-volume logistics operations.",
    highlights: [
      "Reviewed material-handling and warehouse-safety practices across active operations.",
      "Used WMS Exceed reporting to understand inventory and operating workflows.",
      "Presented opportunities to improve high-inflow and high-outflow processes through automated storage and retrieval technology.",
    ],
    tools: ["WMS Exceed"],
  },
];

const enterpriseAiProjects: AgentItem[] = [
  {
    number: "01",
    eyebrow: "Award-winning prototype",
    name: "Alex",
    title: "Fraud investigation call agent",
    copy: "Turns a client fraud-reporting call into an investigation-ready package: key facts and participants, a fraud narrative, a documented 14-question intake, and a follow-up email that asks only what the call did not answer.",
    outcome: "Less time documenting. More time investigating.",
    metrics: [
      { value: "60 → 10–15 min", label: "review time per case" },
      { value: "~$85K", label: "estimated annual savings" },
      { value: "3rd place", label: "RBC Agentic AI Showcase" },
    ],
    stages: ["Call", "Extract", "Narrative", "14-point intake", "Follow-up"],
    skills: ["Transcript analysis", "Structured extraction", "Gap detection", "Human review"],
  },
  {
    number: "02",
    eyebrow: "Escalation intelligence",
    name: "Cypher",
    title: "Faster triage for declined payments",
    copy: "Brings transaction history, triggered controls, and client-authenticity signals into one review for credit, debit, and Zelle escalations, then prepares a response for Operations or the client.",
    outcome: "Analysts keep the decision and rule validation; Cypher removes the slowest collection and synthesis work.",
    metrics: [
      { value: "60–70%", label: "targeted time reduction" },
      { value: "20–30", label: "monthly cases" },
    ],
    next: "Next: test triggered rules inside the same workflow.",
    skills: ["Transaction review", "Risk signals", "Decision support", "Response drafting"],
  },
  {
    number: "03",
    eyebrow: "Control optimization",
    name: "Sentinel",
    title: "Turns missed fraud into stronger rules",
    copy: "Matches missed fraud claims to their transactions, identifies the closest rule that should have fired, and pinpoints the criterion that prevented the alert. It proposes rule updates with comparison statistics—and, when the existing control cannot be repaired, designs a new rule for the emerging pattern.",
    outcome: "A closed learning loop from missed loss to evidence-backed control improvement.",
    stages: ["Missed claim", "Match transaction", "Nearest rule", "Find failed criterion", "Compare", "Recommend"],
    skills: ["Claim matching", "Rule diagnostics", "Impact comparison", "Pattern discovery"],
  },
  {
    number: "04",
    eyebrow: "Fraud intelligence",
    name: "Thematic",
    title: "The morning narrative behind the metrics",
    copy: "Queries case comments, reconstructs what happened, classifies themes, and spots patterns by payment type—so teams start with the story behind yesterday’s movement.",
    outcome: "Faster pattern recognition and a more active review cadence.",
    metrics: [
      { value: "5–6 hrs", label: "weekly capacity returned" },
      { value: "$26K–$31K", label: "annualized at $100/hr" },
    ],
    skills: ["Case retrieval", "Theme classification", "Trend synthesis"],
  },
  {
    number: "05",
    eyebrow: "Personal productivity",
    name: "Email Copilot",
    title: "Drafts that still sound like the sender",
    copy: "Uses a voice reference guide built from Python-cleaned Outlook sent-mail examples, adapting first drafts to the context and recipient without flattening personal voice.",
    outcome: "A repeatable writing system for faster, more authentic first drafts.",
    skills: ["Python", "Voice modeling", "Prompt design", "Recipient context"],
  },
  {
    number: "06",
    eyebrow: "Analyst enablement",
    name: "David",
    title: "Self-serve training for process, code, and data",
    copy: "Pairs procedure and training retrieval with a code-aware tutor that explains commented queries and the data model. New analysts can learn in the flow of work without waiting for a trainer.",
    outcome: "Institutional knowledge becomes available on demand.",
    skills: ["Knowledge retrieval", "Procedure guidance", "Query coaching", "Onboarding"],
  },
];

const workflows: WorkflowItem[] = [
  { kicker: "Conversational fraud operations", title: "AI Voice Case Agent", copy: "An inbound fraud-operations MVP connecting an ElevenLabs voice agent with Twilio, n8n, and a simulated CRM. It captures caller intent, assesses carrier, device, and SMS-pumping risk as the call begins, locates the customer profile, validates an OTP, links every interaction ID, and generates a transcript for downstream analysis and smart case routing.", nodes: "105 nodes", skills: ["ElevenLabs", "Twilio", "Risk orchestration", "Real-time logging"], stages: ["Inbound call", "Phone risk", "Customer lookup", "OTP", "Case log", "Transcript"], href: "https://www.linkedin.com/feed/update/urn:li:activity:7381312465671782402/", cta: "Open the LinkedIn post", embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7381177280397729792?compact=1" },
  { kicker: "Fraud intelligence", title: "Fraud Daily Intelligence Briefing", copy: "An AI-generated morning narrative layered over confirmed cases, rule performance, payment themes, amount thresholds, regulatory eligibility, and SLA movement. It turns yesterday’s charts into an audience-specific brief for leaders, strategy, operations, and investigations.", nodes: "35 nodes", skills: ["Gemini", "Risk metrics", "Email"], stages: ["Cases", "Rules", "Themes", "Synthesis", "Brief"], href: "https://www.linkedin.com/feed/update/urn:li:activity:7409216701814398976/", cta: "Open the LinkedIn post", embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7409100333303402496?compact=1" },
  { kicker: "Conversational analytics", title: "Natural-Language Fraud Data Agent", copy: "A schema-aware copilot that translates natural-language questions into SQL, queries controlled database views, and summarizes the result in Slack—giving teams faster access to data without exposing unrestricted tables.", nodes: "46 nodes", skills: ["Tool use", "SQL", "Slack"], stages: ["Question", "Discover", "Query", "Summarize"], href: "https://www.linkedin.com/feed/update/urn:li:activity:7389300096309288960/", cta: "Open the Data + RAG demo post", embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7389156746931490816?compact=1" },
  { kicker: "Knowledge retrieval", title: "Fraud RAG Knowledge Bot", copy: "A companion mode in the same AI copilot: it retrieves relevant policies, procedures, and training context from Supabase vectors, then answers through a concise Slack interface. Metadata-aware retrieval keeps the response grounded in the right source.", nodes: "12 nodes", skills: ["RAG", "OpenAI embeddings", "Supabase"], stages: ["Ingest", "Embed", "Retrieve", "Answer"], href: "https://www.linkedin.com/feed/update/urn:li:activity:7389300096309288960/", cta: "Watch the shared Data + RAG demo" },
  { kicker: "Multimodal automation", title: "Product Creative Studio", copy: "A file-to-campaign workflow that writes prompts, generates product graphics and video, polls for completion, and delivers finished assets.", nodes: "13 nodes", skills: ["OpenAI", "Image", "Video"], stages: ["Upload", "Prompt", "Generate", "Deliver"] },
  { kicker: "Travel planning", title: "Travel Itinerary Concierge", copy: "Combines flight, stay, restaurant, and attraction data into a structured itinerary that can be requested and delivered conversationally through Telegram.", nodes: "35 nodes", skills: ["Travel APIs", "Agents", "Telegram"], stages: ["Request", "Search", "Plan", "Store", "Send"] },
  { kicker: "Content systems", title: "Viral Short-Form Repurposing Engine", copy: "Analyzes the structure and visual language of high-performing short-form content, develops an original variant, generates the asset, and prepares it for cross-platform distribution.", nodes: "38 nodes", skills: ["Vision analysis", "Video generation", "Distribution"], stages: ["Analyze", "Rewrite", "Generate", "Publish"] },
  { kicker: "Professional networking", title: "LinkedIn Referral Assistant", copy: "Combines public profile context, a structured contact list, lightweight memory, and an AI drafting step to prepare more relevant referral outreach.", nodes: "12 nodes", skills: ["Profile research", "Agent memory", "Sheets"], stages: ["Profile", "Context", "Draft", "Track"] },
  { kicker: "Document intelligence", title: "OCR Document Extractor", copy: "Accepts an image or PDF through a form, extracts the underlying text, and uses an AI pass to turn the result into structured, usable information.", nodes: "3 nodes", skills: ["OCR", "OpenAI", "Document intake"], stages: ["Upload", "Extract", "Structure"] },
];

const proofPoints = [
  { type: "Agentic product demo", title: "Finesse acts on financial insights—with your approval", copy: "A preview of an agentic finance experience that explains the next best action, works through iMessage, and keeps every decision under the user’s control.", href: "https://www.linkedin.com/feed/update/urn:li:activity:7505618963377274882/", cta: "Watch the Finesse agent demo" },
  { type: "Enterprise recognition", title: "3rd place at RBC’s Agentic AI Showcase", copy: "Selected from 180+ submissions to represent City National Bank, then presented an AI-enabled fraud use case across RBC.", href: "https://www.linkedin.com/feed/update/urn:li:activity:7478100192597213184/", cta: "Read the showcase post" },
  { type: "Product thinking", title: "Why money software should work in the background", copy: "The product thesis behind Finesse: learn normal behavior, surface what changed, and make the interface available when useful—not mandatory.", href: "https://www.linkedin.com/feed/update/urn:li:activity:7495457021153005568/", cta: "Read the Finesse post" },
  { type: "Build in public", title: "Making investment research legible for beginners", copy: "How Stockee brings fragmented market signals together and translates them into plain-English context instead of stock picks.", href: "https://www.linkedin.com/feed/update/urn:li:activity:7475525658404745216/", cta: "Read the Stockee post" },
];

const capabilities = [
  {
    number: "01",
    title: "Fraud & risk",
    items: ["Fraud strategy & decisioning", "Account takeover & authentication", "Payments fraud: wires, ACH & Zelle", "Fraud rules & controls", "Portfolio monitoring & case review", "Behavioral and social-engineering analysis", "ThreatMetrix, RSA, Pindrop & Omilia", "Reg E, Reg Z, NACHA & UTR"],
  },
  {
    number: "02",
    title: "Data & analytics",
    items: ["SQL: Snowflake, SQL Server & Oracle", "Python and R for analysis", "Tableau and advanced Excel", "KPI frameworks & reporting", "Data pipeline design", "Experimentation & statistical analysis", "Decision trees & behavioral features", "Data visualization & storytelling"],
  },
  {
    number: "03",
    title: "AI & automation",
    items: ["AI-assisted product prototyping", "Agent & workflow design", "Prompt engineering", "RAG & vector search", "n8n automations", "LLM evaluation & iteration", "Conversational and voice AI", "Human review & document intelligence"],
  },
  {
    number: "04",
    title: "Product & delivery",
    items: ["Product strategy & management", "Requirements, use cases & prioritization", "Cross-functional execution", "AI-assisted web and mobile builds", "API & webhook integrations", "Supabase, Plaid, Twilio & Stripe", "Agile, Scrum, Jira & Confluence", "Salesforce, UAT & regression testing", "Process mapping, procedures & playbooks", "Stakeholder management & analyst training"],
  },
];

function SectionIntro({ index, label, title, copy, light = false }: { index: string; label: string; title: string; copy: string; light?: boolean }) {
  return <div className={`section-intro ${light ? "section-intro-light" : ""}`}><div><Badge variant="outline" className="section-badge">{index} / {label}</Badge><h2>{title}</h2></div><p>{copy}</p></div>;
}

function PhoneFrame({ src, alt, className }: { src: string; alt: string; className: string }) {
  return <div className={`phone-shell ${className}`}><i className="phone-button phone-button-one" aria-hidden="true" /><i className="phone-button phone-button-two" aria-hidden="true" /><div className="phone-screen"><span className="phone-island" aria-hidden="true" /><Image src={src} width={1260} height={2736} sizes="(max-width: 760px) 62vw, 22vw" alt={alt} /></div></div>;
}

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org", "@type": "Person", name: "Arush Kukreja", url: "https://www.linkedin.com/in/arushkukreja", jobTitle: "Fraud Strategy Lead",
    sameAs: ["https://www.linkedin.com/in/arushkukreja", "https://stockee.co"],
    knowsAbout: ["Fraud analytics", "Product strategy", "Applied AI", "AI automation"],
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <header className="site-header shell"><a className="monogram" href="#top" aria-label="Arush Kukreja, home">AK<span>.</span></a><nav className="nav" aria-label="Primary navigation"><a href="#work">Experience</a><a href="#ai-lab">AI systems</a><a href="#projects">Products</a><a href="#signals">Writing</a></nav><Button asChild variant="outline" size="sm" className="header-button"><a href="#connect">Let&apos;s connect <ArrowUpRight aria-hidden="true" /></a></Button></header>
      <div className="hero-content shell"><div className="hero-copy"><h1>I build at the intersection of <em>strategy, product, and AI.</em></h1><TypewriterText className="hero-intro" text="Fraud strategist and product builder using AI to transform complex problems into practical systems, useful products, and smarter ways of working." /><div className="hero-actions"><Button asChild size="lg" className="primary-action"><a href="#ai-lab">Explore the systems <ArrowDown aria-hidden="true" /></a></Button><Button asChild size="lg" variant="outline" className="secondary-action"><a href="/Arush-Kukreja-Resume.pdf" download><Download aria-hidden="true" />Résumé</a></Button></div></div><div className="hero-signal" role="group" aria-label="Core focus areas"><a className="focus-box focus-box-one" href="#work" aria-label="Explore fraud strategy experience"><span>01</span><strong>Fraud strategy</strong><small>Controls, decisions, and trust</small></a><a className="focus-box focus-box-two" href="#projects" aria-label="Explore products"><span>02</span><strong>Product building</strong><small>From problem to working product</small></a><a className="focus-box focus-box-three" href="#ai-lab" aria-label="Explore applied AI systems"><span>03</span><strong>Applied AI</strong><small>Useful agents and automation</small></a></div></div><div className="hero-scroll shell"><span>Selected impact</span><ArrowDown aria-hidden="true" /></div>
    </section>

    <section className="impact-section" aria-label="Selected impact"><div className="shell impact-grid">{impact.map((item) => <div key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

    <section className="section work-section" id="work"><div className="shell"><SectionIntro index="01" label="Experience" title="Protecting trust with data and better decisions." copy="Fraud strategy, authentication, analytics, and the controls built from them." /><ExperienceAccordion items={experience} /></div></section>

    <section className="section ai-section" id="ai-lab"><div className="ai-glow" aria-hidden="true" /><div className="shell"><SectionIntro light index="02" label="Applied AI" title="Agents built around the work." copy="Workplace agents and independent automations designed to return time and sharpen judgment." /><div className="subsection-heading"><div><Badge variant="outline">02A / Workplace AI</Badge><h3>AI prototypes for fraud operations.</h3></div><p>Public-safe concepts for investigations, control strategy, and analyst enablement.</p></div><AgentAccordion items={enterpriseAiProjects} />
      <div className="subsection-heading workflow-heading"><div><Badge variant="outline">02B / Independent automations</Badge><h3>Independent n8n workflows.</h3></div><p>Demo-led experiments connecting models, data, and APIs. Open one to explore its architecture.</p></div><WorkflowLibrary items={workflows} /><p className="portfolio-note">Workplace concepts are prototypes. Savings and capacity figures are estimates based on stated review volume and time assumptions. Employer-specific data and implementation details are excluded.</p></div></section>

    <section className="section projects-section shell" id="projects"><SectionIntro index="03" label="Products" title="From thesis to working products." copy="Three AI-assisted builds across personal finance, investing, and thoughtful gifting." />
      <Card className="project-card finesse-card"><div className="project-copy"><Badge>Live on iOS</Badge><p className="project-number">01 / PERSONAL FINANCE</p><h3>Finesse</h3><p className="project-tagline">Your money, but it actually watches itself.</p><p>Finesse connects accounts through Plaid, learns normal behavior, detects recurring costs, and surfaces severity-tagged anomalies—so users know what changed without reviewing every transaction.</p><div className="product-tools"><span>Tools used</span><div className="feature-row"><Badge variant="secondary">SwiftUI</Badge><Badge variant="secondary">Plaid</Badge><Badge variant="secondary">Supabase</Badge><Badge variant="secondary">RevenueCat</Badge><Badge variant="secondary">APNs</Badge></div></div><Button asChild variant="outline" className="project-link"><a href="https://finessefinance.us" target="_blank" rel="noreferrer">Visit Finesse <ArrowUpRight aria-hidden="true" /></a></Button></div><div className="product-visual finesse-visual" aria-label="Finesse Finance screens framed in iPhone devices"><div className="phone-stage"><PhoneFrame className="phone-left" src="/finesse-anomaly.png" alt="Finesse anomaly alert linked to its underlying transaction" /><PhoneFrame className="phone-center" src="/finesse-home.png" alt="Finesse home screen showing safe-to-spend and monthly finances" /><PhoneFrame className="phone-right" src="/finesse-recurring.png" alt="Finesse recurring subscription history and annual cost" /></div><span className="float-signal float-signal-one">Unusual spend caught</span><span className="float-signal float-signal-two">$3,360 under forecast</span></div></Card>
      <Card className="project-card emptyhanded-card"><div className="product-visual emptyhanded-visual" aria-label="EmptyHanded AI gifting product preview"><div className="gift-orbit" aria-hidden="true" /><div className="gift-card gift-event"><p>UPCOMING</p><div><Image src="/emptyhanded-maya.jpg" width={120} height={120} alt="Maya profile" /><span><strong>Maya&apos;s birthday</strong><small>7 days away</small></span></div></div><div className="gift-card gift-reason"><span>WHY THIS FITS MAYA</span><p>“She carries a notebook everywhere. Something tactile and personal feels right.”</p></div><div className="gift-products"><Image src="/emptyhanded-journal.jpg" width={480} height={480} alt="Personalized journal gift suggestion" /><Image src="/emptyhanded-board.jpg" width={480} height={480} alt="Curated serving board gift suggestion" /><Image src="/emptyhanded-home.jpg" width={480} height={480} alt="Homeware gift suggestion" /></div><div className="gift-ready"><strong>5 thoughtful picks ready</strong><span>→</span></div></div><div className="project-copy"><Badge>Latest product · live web app</Badge><p className="project-number">02 / AI + CONSUMER</p><h3>EmptyHanded</h3><p className="project-tagline">Never show up empty handed again.</p><p>An AI gifting concierge that remembers the people and occasions that matter, learns what each person loves, and sends thoughtful recommendations before the date sneaks up.</p><div className="product-tools"><span>Tools used</span><div className="feature-row"><Badge variant="secondary">Next.js</Badge><Badge variant="secondary">React</Badge><Badge variant="secondary">Gemini</Badge><Badge variant="secondary">Tailwind CSS</Badge><Badge variant="secondary">Vercel</Badge></div></div><Button asChild variant="outline" className="project-link"><a href="https://emptyhanded.app" target="_blank" rel="noreferrer">Visit EmptyHanded <ArrowUpRight aria-hidden="true" /></a></Button></div></Card>
      <Card className="project-card stockee-card"><div className="project-copy"><Badge>Live web product</Badge><p className="project-number">03 / AI + FINANCE</p><h3>Stockee</h3><p className="project-tagline">The market, translated.</p><p>Stockee closes the knowledge gap for newer investors by combining price action and technicals, fundamentals, SEC filings, earnings-call transcripts, institutional and insider activity, congressional trades, prediction markets, YouTube, and Reddit—then explaining what the signals mean.</p><div className="product-tools"><span>Tools used</span><div className="feature-row"><Badge variant="secondary">Next.js</Badge><Badge variant="secondary">Supabase</Badge><Badge variant="secondary">Gemini</Badge><Badge variant="secondary">Plaid</Badge><Badge variant="secondary">Stripe</Badge><Badge variant="secondary">PostHog</Badge><Badge variant="secondary">Vercel</Badge></div></div><Button asChild variant="outline" className="project-link"><a href="https://stockee.co" target="_blank" rel="noreferrer">Visit Stockee <ArrowUpRight aria-hidden="true" /></a></Button></div><div className="product-visual stockee-visual" aria-label="Stockee product intelligence interface combining market, company, and alternative data"><div className="stockee-orbit" aria-hidden="true" /><div className="stockee-market-card"><div className="stockee-market-top"><span><strong>NVDA</strong><small>NVIDIA</small></span><b>SNAPSHOT</b></div><div className="stockee-price"><strong>$182.14</strong><span>+2.8% today</span></div><div className="stockee-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="stockee-explainer"><span>STOCKEE TRANSLATION</span><strong>Growth is still doing the heavy lifting.</strong><p>Revenue momentum remains strong, but the valuation leaves less room for an earnings miss.</p></div><div className="stockee-signal-grid"><div><span>EARNINGS</span><strong>Beat</strong><small>3 of 4 quarters</small></div><div><span>INSTITUTIONS</span><strong>Adding</strong><small>Net accumulation</small></div><div><span>SENTIMENT</span><strong>Mixed</strong><small>Watch volatility</small></div></div><div className="stockee-source-panel"><strong>RESEARCH INPUTS</strong><div className="stockee-source-list"><span>Market data</span><span>Technicals</span><span>Fundamentals</span><span>SEC filings</span><span>Earnings calls</span><span>Institutions</span><span>Insider trades</span><span>Congress</span><span>Prediction markets</span><span>YouTube</span><span>Reddit</span></div></div></div></Card>
    </section>

    <section className="section signals-section" id="signals"><div className="shell"><SectionIntro index="04" label="Writing" title="Proof beyond the job titles." copy="Recognition and ideas shared while building." /><div className="proof-grid">{proofPoints.map((item, index) => <Card className="proof-card" key={item.title}><div className="proof-card-top"><span>0{index + 1}</span><Badge variant="outline">{item.type}</Badge></div><h3>{item.title}</h3><p>{item.copy}</p><a href={item.href} target="_blank" rel="noreferrer">{item.cta} <ArrowUpRight aria-hidden="true" /></a></Card>)}</div></div></section>
    <section className="section capabilities-section"><div className="shell capabilities-grid"><div className="capabilities-intro"><Badge variant="outline">Core skills</Badge><h2>Built to connect the dots.</h2><p>Fraud expertise, analytical depth, product leadership, and AI-assisted prototyping.</p></div><div className="capability-groups">{capabilities.map((group) => <article className="capability-group" key={group.title}><header><span>{group.number}</span><h3>{group.title}</h3></header><div className="capability-items">{group.items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></div></section>
    <footer className="footer" id="connect"><div className="shell"><Badge variant="outline">Start a conversation</Badge><h2>Have a hard problem where risk, data, product, and AI meet?</h2><p className="contact-intro">Choose the way that works for you.</p><div className="contact-actions"><Button asChild size="lg" className="footer-action"><a href="/book">Book a call <ArrowUpRight aria-hidden="true" /></a></Button><Button asChild size="lg" variant="outline" className="footer-action contact-alternative"><a href="mailto:arushkukrejaa@gmail.com">Send an email <ArrowUpRight aria-hidden="true" /></a></Button><Button asChild size="lg" variant="outline" className="footer-action contact-alternative"><a href="https://www.linkedin.com/in/arushkukreja" target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight aria-hidden="true" /></a></Button></div><div className="footer-bottom"><span>Arush Kukreja © 2026</span><div><a href="https://www.linkedin.com/in/arushkukreja" target="_blank" rel="noreferrer">LinkedIn</a><a href="/Arush-Kukreja-Resume.pdf" download>Résumé</a><a href="#top">Back to top ↑</a></div></div></div></footer>
  </main>;
}
