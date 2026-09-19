"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ExperienceItem = {
  period: string;
  role: string;
  focus: string;
  company: string;
  summary: string;
  highlights: string[];
  tools?: string[];
};

export type AgentItem = {
  number: string;
  eyebrow: string;
  name: string;
  title: string;
  copy: string;
  outcome: string;
  metrics?: { value: string; label: string }[];
  stages?: string[];
  next?: string;
  skills: string[];
};

export type WorkflowItem = {
  kicker: string;
  title: string;
  copy: string;
  nodes: string;
  skills: string[];
  stages: string[];
  href?: string;
  cta?: string;
  embedUrl?: string;
};

function Skills({ items }: { items: string[] }) {
  return (
    <div className="skill-badges">
      {items.map((item) => (
        <Badge variant="secondary" key={item}>{item}</Badge>
      ))}
    </div>
  );
}

export function ExperienceAccordion({ items }: { items: ExperienceItem[] }) {
  return (
    <Accordion type="single" collapsible defaultValue="experience-0" className="experience-accordion">
      {items.map((item, index) => (
        <AccordionItem value={`experience-${index}`} className="experience-accordion-item" key={`${item.company}-${item.role}`}>
          <AccordionTrigger className="experience-trigger">
            <span className="experience-trigger-grid">
              <span className="experience-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="experience-role">
                <strong>{item.role}</strong>
                <small>{item.focus}</small>
              </span>
              <span className="experience-company">{item.company}</span>
              <span className="experience-period">{item.period}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="experience-content">
            <p>{item.summary}</p>
            <ul>
              {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
            {item.tools?.length ? (
              <div className="experience-tools">
                <span>Tools used</span>
                <Skills items={item.tools} />
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function AgentAccordion({ items }: { items: AgentItem[] }) {
  return (
    <Accordion type="single" collapsible defaultValue="agent-0" className="agent-accordion">
      {items.map((item, index) => (
        <AccordionItem value={`agent-${index}`} className="agent-accordion-item" key={item.name}>
          <AccordionTrigger className="agent-trigger">
            <span className="agent-trigger-grid">
              <span className="agent-index">{item.number}</span>
              <span className="agent-identity">
                <span className="agent-name">{item.name}</span>
                <strong>{item.title}</strong>
              </span>
              <Badge variant="outline">{item.eyebrow}</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="agent-content">
            <div className="agent-content-lead">
              <p>{item.copy}</p>
              <strong>{item.outcome}</strong>
              {item.next && <p className="agent-next"><span aria-hidden="true">↗</span>{item.next}</p>}
            </div>
            {item.stages && (
              <div className="agent-stages" aria-label={`${item.name} workflow: ${item.stages.join(", ")}`}>
                {item.stages.map((stage, stageIndex) => <span key={stage}><i>{String(stageIndex + 1).padStart(2, "0")}</i>{stage}</span>)}
              </div>
            )}
            {item.metrics && (
              <div className="agent-metrics">
                {item.metrics.map((metric) => <div key={metric.value}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
              </div>
            )}
            <Skills items={item.skills} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function WorkflowRows({ items, offset = 0 }: { items: WorkflowItem[]; offset?: number }) {
  return (
    <Accordion type="single" collapsible className="workflow-accordion">
      {items.map((item, index) => (
        <AccordionItem value={`workflow-${offset + index}`} className="workflow-accordion-item" key={item.title}>
          <AccordionTrigger className="workflow-trigger">
            <span className="workflow-trigger-grid">
              <span className="workflow-index">{String(offset + index + 1).padStart(2, "0")}</span>
              <span className="workflow-identity">
                <small>{item.kicker}</small>
                <strong>{item.title}</strong>
              </span>
              <span className="workflow-node-count">{item.nodes}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="workflow-content">
            {item.embedUrl && (
              <div className="workflow-demo">
                <div className="workflow-demo-header"><span>Embedded demo</span><small>LinkedIn · video</small></div>
                <iframe
                  src={item.embedUrl}
                  title={`${item.title} demo`}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            )}
            <p>{item.copy}</p>
            <div className="workflow-path" aria-label={`${item.title} workflow: ${item.stages.join(", ")}`}>
              {item.stages.map((stage) => <span key={stage}>{stage}</span>)}
            </div>
            <Skills items={item.skills} />
            {item.href && (
              <a className="workflow-source-link" href={item.href} target="_blank" rel="noreferrer">
                {item.cta ?? "View project source"} <span aria-hidden="true">↗</span>
              </a>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function WorkflowLibrary({ items, initialCount = 5 }: { items: WorkflowItem[]; initialCount?: number }) {
  const [showAll, setShowAll] = useState(false);
  const featured = items.slice(0, initialCount);
  const additional = items.slice(initialCount);

  return (
    <div className="workflow-library">
      <WorkflowRows items={featured} />
      {additional.length > 0 && (
        <>
          <div id="additional-workflows" hidden={!showAll} className="additional-workflows">
            <WorkflowRows items={additional} offset={initialCount} />
          </div>
          <Button
            type="button"
            variant="outline"
            className="workflow-toggle"
            aria-expanded={showAll}
            aria-controls="additional-workflows"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "Show fewer workflows" : `See ${additional.length} more workflows`}
          </Button>
        </>
      )}
    </div>
  );
}
