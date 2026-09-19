import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Arush's portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Arush Kukreja/);
  assert.match(html, /Your money, but it actually watches itself/);
  assert.match(html, /Stockee/);
  assert.match(html, /Visit Stockee/);
  assert.doesNotMatch(html, /Visit Stockee\.co/);
  assert.match(html, /EmptyHanded/);
  assert.match(html, /Fraud investigation call agent/);
  assert.match(html, /60 → 10–15 min/);
  assert.match(html, /estimated annual savings/);
  assert.match(html, /Cypher/);
  assert.match(html, /Sentinel/);
  assert.match(html, /Turns missed fraud into stronger rules/);
  assert.match(html, /Thematic/);
  assert.match(html, /Email Copilot/);
  assert.match(html, /David/);
  assert.match(html, /Fraud Daily Intelligence Briefing/);
  assert.match(html, /02A \/ Workplace AI/);
  assert.match(html, /AI prototypes for fraud operations/);
  assert.match(html, /02B \/ Independent automations/);
  assert.match(html, /Independent n8n workflows/);
  assert.doesNotMatch(html, /A small roster of specialist agents/);
  assert.match(html, /People Analytics Data Scientist Intern/);
  assert.match(html, /Lead Data Science Analyst/);
  assert.match(html, /Senior Data Science Analyst/);
  assert.match(html, /Dovel Technologies/);
  assert.match(html, /George Mason University/);
  assert.match(html, /West Coast Consulting/);
  assert.match(html, /Inventory Utilization Analyst/);
  assert.match(html, /Ariel Corporation/);
  assert.match(html, /Agility/);
  assert.doesNotMatch(html, /Kuwait Oil Company/);
  assert.match(html, /Travel Itinerary Concierge/);
  assert.match(html, /Fraud RAG Knowledge Bot/);
  assert.match(html, /7381312465671782402/);
  assert.match(html, /7409216701814398976/);
  assert.match(html, /7389300096309288960/);
  assert.match(html, /7381177280397729792/);
  assert.match(html, /7409100333303402496/);
  assert.match(html, /7389156746931490816/);
  assert.match(html, /See 4 more workflows/);
  assert.doesNotMatch(html, /Any-Ticker Investment Research Engine/);
  assert.doesNotMatch(html, /AI Car Campaign Studio/);
  assert.doesNotMatch(html, /Portfolio Intelligence System/);
  assert.doesNotMatch(html, /Gmail Action Automation/);
  assert.match(html, /Proof beyond the job titles/);
  assert.match(html, /href="#work"[^>]+aria-label="Explore fraud strategy experience"/);
  assert.match(html, /href="#projects"[^>]+aria-label="Explore products"/);
  assert.match(html, /href="#ai-lab"[^>]+aria-label="Explore applied AI systems"/);
  assert.match(html, /3rd place/);
  assert.doesNotMatch(html, /3rd \/ 180\+/);
  assert.match(html, /Finesse acts on financial insights/);
  assert.match(html, /7505618963377274882/);
  assert.match(html, /RBC’s Agentic AI Showcase/);
  assert.match(html, /Core skills/);
  assert.match(html, /ThreatMetrix/);
  assert.match(html, /AI-assisted product prototyping/);
  assert.match(html, /AI-assisted web and mobile builds/);
  assert.match(html, /From thesis to working products/);
  assert.match(html, /Stockee product intelligence interface/);
  assert.match(html, /STOCKEE TRANSLATION/);
  assert.match(html, /Tools used/);
  assert.match(html, /SwiftUI/);
  assert.match(html, /RevenueCat/);
  assert.match(html, /WMS Exceed/);
  assert.doesNotMatch(html, /Behavioral baselines/);
  assert.doesNotMatch(html, /Gemini recommendations/);
  assert.doesNotMatch(html, /Automated pipelines/);
  assert.doesNotMatch(html, /section-disclosure|section-toggle/);
  assert.doesNotMatch(html, /Applied AI engineering/);
  assert.doesNotMatch(html, /Full-stack product development/);
  assert.doesNotMatch(html, /Fraud intelligence · Product systems · Applied AI/);
  assert.doesNotMatch(html, /THE OPERATING SYSTEM/);
  assert.doesNotMatch(html, /Operating model/);
  assert.doesNotMatch(html, /One throughline/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("ships authentic product assets and source links", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const assetUrls = [
    "../public/finesse-home.png",
    "../public/finesse-anomaly.png",
    "../public/finesse-recurring.png",
    "../public/stockee-live.png",
    "../public/emptyhanded-maya.jpg",
    "../public/emptyhanded-journal.jpg",
    "../public/emptyhanded-board.jpg",
    "../public/emptyhanded-home.jpg",
  ];
  const assetStats = await Promise.all(
    assetUrls.map((url) => stat(new URL(url, import.meta.url))),
  );

  for (const asset of assetStats) {
    assert.ok(asset.isFile());
    assert.ok(asset.size > 10_000);
  }

  assert.match(page, /https:\/\/finessefinance\.us/);
  assert.match(page, /https:\/\/stockee\.co/);
  assert.match(page, /https:\/\/emptyhanded\.app/);
  assert.match(page, /\/finesse-home\.png/);
  assert.match(page, /stockee-market-card/);
  assert.doesNotMatch(page, /section-disclosure|section-toggle/);
  assert.match(css, /\.skill-badges \[data-slot="badge"\].*background: #e8e0ce/);
  assert.match(page, /Agent & workflow design/);
  assert.match(page, /Product Creative Studio/);
});
