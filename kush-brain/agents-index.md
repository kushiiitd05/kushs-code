# Kush's Code — Agents Index
> All 72 agents from ~/.claude/agents/ — auto-available in every session
> Reference as: "Use the [agent-name] agent to..."

---

## AI / ML AGENTS

| Agent | File | Use When |
|---|---|---|
| nlp-engineer | `ai-nlp-engineer.md` | NLP pipelines, BERT, classification, NER, spaCy |
| llm-architect | `ai-llm-architect.md` | LLM system design, fine-tuning, model selection |
| mlops-engineer | `ai-mlops-engineer.md` | MLflow, W&B, model registry, CI/CD for models |
| computer-vision | `ai-computer-vision-engineer.md` | CV, YOLO, image detection |

**Note:** All AI agents require A100 for meaningful work. Ask user to connect VPN first.

---

## ENGINEERING AGENTS

| Agent | File | Use When |
|---|---|---|
| ai-engineer | `engineering-ai-engineer.md` | AI system integration |
| backend-architect | `engineering-backend-architect.md` | Backend design, API architecture |
| frontend-developer | `engineering-frontend-developer.md` | React, Vue, CSS, UI components |
| data-engineer | `engineering-data-engineer.md` | Data pipelines, ETL, warehouses |
| devops-automator | `engineering-devops-automator.md` | CI/CD, infrastructure, Docker |
| security-engineer | `engineering-security-engineer.md` | Security analysis, pen testing |
| mobile-app-builder | `engineering-mobile-app-builder.md` | iOS, Android, React Native |
| embedded-firmware | `engineering-embedded-firmware-engineer.md` | Firmware, C, embedded systems |
| rapid-prototyper | `engineering-rapid-prototyper.md` | Quick POC, prototype, MVP |
| incident-commander | `engineering-incident-response-commander.md` | Incidents, RCA, postmortem |
| doc-updater | `engineering-doc-updater.md` | Documentation updates |
| legacy-modernizer | `devex-legacy-modernizer.md` | Old code, legacy, modernize |
| mcp-developer | `devex-mcp-developer.md` | Build MCP servers, MCP tools |
| optimization-architect | `engineering-autonomous-optimization-architect.md` | System optimization |

---

## DESIGN AGENTS

| Agent | File | Use When |
|---|---|---|
| ui-designer | `design-ui-designer.md` | UI components, visual design |
| ux-architect | `design-ux-architect.md` | UX flows, information architecture |
| ux-researcher | `design-ux-researcher.md` | User research, usability |
| brand-guardian | `design-brand-guardian.md` | Brand consistency |
| visual-storyteller | `design-visual-storyteller.md` | Data visualization, infographics |
| image-prompt-engineer | `design-image-prompt-engineer.md` | AI image generation prompts |
| inclusive-visuals | `design-inclusive-visuals-specialist.md` | Accessibility, inclusive design |
| whimsy-injector | `design-whimsy-injector.md` | Creative, playful design |

---

## RESEARCH AGENTS

| Agent | File | Use When |
|---|---|---|
| academic-researcher | `research-academic-researcher.md` | Papers, literature, surveys |
| technology-scout | `research-technology-scout.md` | New tools, frameworks, what's new |

---

## TESTING AGENTS

| Agent | File | Use When |
|---|---|---|
| tdd-guide | `testing-tdd-guide.md` | TDD workflow, test writing |
| error-detective | `testing-error-detective.md` | Debug, crash investigation |
| build-resolver | `testing-build-error-resolver.md` | Build failures |
| e2e-runner | `testing-e2e-runner.md` | E2E testing, Playwright |
| security-reviewer | `testing-security-reviewer.md` | Security code review |
| chaos-engineer | `testing-chaos-engineer.md` | Chaos, resilience testing |

---

## INFRASTRUCTURE AGENTS

| Agent | File | Use When |
|---|---|---|
| sre-engineer | `infra-sre-engineer.md` | SLO, reliability, on-call |
| kubernetes-specialist | `infra-kubernetes-specialist.md` | k8s, Helm, pods, clusters |

---

## ORCHESTRATION AGENTS

| Agent | File | Use When |
|---|---|---|
| knowledge-synthesizer | `orchestration-knowledge-synthesizer.md` | Multi-agent coordination |
| context-manager | `orchestration-context-manager.md` | Session save/restore |
| loop-operator | `orchestration-loop-operator.md` | Recurring tasks |

---

## REVIEW AGENTS

| Agent | File | Use When |
|---|---|---|
| python-reviewer | `review-python-reviewer.md` | Python code review |
| typescript-reviewer | `review-typescript-reviewer.md` | TypeScript code review |

---

## QUICK REFERENCE — MOST USED

```
New feature     → tdd-guide agent first
Code written    → python-reviewer OR typescript-reviewer
Bug/error       → error-detective agent
Architecture    → backend-architect + sequential-thinking MCP
Security issue  → security-reviewer + security-engineer
NLP task        → nlp-engineer (A100 required)
LLM system      → llm-architect (A100 preferred)
UI component    → ui-designer + check magic-ui MCP first
Docs needed     → doc-updater
New MCP server  → mcp-developer agent
```

---

## PARALLEL AGENT EXECUTION PATTERN

For complex analysis — launch MULTIPLE agents simultaneously:

```
Example: Security audit
  Agent 1: security-reviewer on auth module
  Agent 2: security-engineer on API layer
  Agent 3: python-reviewer/typescript-reviewer on utilities

Example: Feature implementation
  Agent 1: backend-architect → design the API
  Agent 2: tdd-guide → write tests first
  Agent 3: frontend-developer → UI component
```

Use the Agent tool with run_in_background=true for independent agents.
