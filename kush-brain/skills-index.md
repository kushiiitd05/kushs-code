# Kush's Code — Skills Index
> All 62 skills from ~/.claude/skills/ — available in every Kush's Code session
> Load with: @skill-name or reference in conversation

---

## HOW TO USE SKILLS

Skills auto-load based on task keywords (see CLAUDE.md skill table).
To force-load: mention the skill name or prefix your request with "Use [skill-name] to..."

Two-phase loading (from claw-dev architecture analysis):
1. Frontmatter loaded at startup (name + description — cheap)
2. Full skill content loaded on first use (expensive — only when needed)

---

## AI / ML SKILLS

| Skill | Triggers | Where to Run |
|---|---|---|
| `agentdb-vector-search` | RAG, embeddings, vector search, semantic search | Local or A100 |
| `agentdb-advanced` | QUIC sync, multi-DB, custom distance metrics | A100 preferred |
| `agentdb-learning` | RL algorithms, Decision Transformer, training | A100 |
| `agentdb-optimization` | Quantization, HNSW indexing, 150x faster search | A100 |
| `agentdb-memory-patterns` | Persistent memory, session memory, long-term storage | Local |
| `reasoningbank-agentdb` | Adaptive learning + AgentDB integration | A100 |
| `reasoningbank-intelligence` | Pattern recognition, strategy optimization | A100 |
| `flow-nexus-neural` | Neural networks in E2B sandboxes | A100 |
| `hugging-face-model-trainer` | HF training workflows, fine-tuning | A100 required |

---

## AGENT / ORCHESTRATION SKILLS

| Skill | Triggers |
|---|---|
| `swarm-orchestration` | multi-agent, orchestrate, parallel agents |
| `swarm-advanced` | complex distributed workflows, research swarms |
| `hive-mind-advanced` | queen-led multi-agent, consensus mechanisms |
| `agentscope-patterns` | multi-agent system, A2A protocol, Alibaba framework |
| `stream-chain` | stream-JSON, multi-agent pipelines, sequential workflows |
| `flow-nexus-swarm` | cloud swarm deployment, event-driven workflows |
| `flow-nexus-platform` | Flow Nexus auth, sandboxes, deployment |

---

## CODING / ENGINEERING SKILLS

| Skill | Triggers |
|---|---|
| `tdd-mastery` | test, TDD, pytest, jest, Red-Green-Refactor |
| `api-design-patterns` | REST API, OpenAPI, pagination, versioning |
| `database-optimization` | PostgreSQL, MySQL, query tuning, indexes |
| `monitoring-observability` | OpenTelemetry, Prometheus, Grafana, logging |
| `mcp-server-patterns` | build MCP server, MCP tool, MCP transport |
| `security-review` | auth, secrets, input validation, API endpoints |
| `e2e-testing` | Playwright, E2E, Page Object Model |
| `eval-harness` | evaluation framework, EDD, Claude Code eval |
| `pair-programming` | pair programming, driver/navigator, real-time |
| `performance-analysis` | bottleneck, optimization, swarm performance |
| `hooks-automation` | Claude Code hooks, pre/post tool hooks |

---

## ARCHITECTURE / DESIGN SKILLS

| Skill | Triggers |
|---|---|
| `sparc-methodology` | SPARC, Spec/Pseudocode/Architecture/Refinement |
| `skill-builder` | create new skill, write YAML skill |
| `claudeforge-skill` | CLAUDE.md generation, enhance CLAUDE.md |
| `v3-ddd-architecture` | Domain-Driven Design, bounded contexts |
| `v3-core-implementation` | DDD domains, clean architecture |
| `v3-cli-modernization` | CLI modernization, interactive prompts |
| `v3-integration-deep` | agentic-flow integration, ADR-001 |
| `v3-mcp-optimization` | MCP connection pooling, load balancing |
| `v3-memory-unification` | unify memory systems, AgentDB HNSW |
| `v3-performance-optimization` | Flash Attention, search improvements |
| `v3-security-overhaul` | CVE fixes, security architecture |
| `v3-swarm-coordination` | 15-agent hierarchical mesh |

---

## GITHUB / DEVOPS SKILLS

| Skill | Triggers |
|---|---|
| `github-code-review` | GitHub PR review, AI swarm code review |
| `github-multi-repo` | multi-repo coordination, sync repos |
| `github-project-management` | GitHub issues, project boards, sprints |
| `github-release-management` | versioning, releases, changelog |
| `github-workflow-automation` | GitHub Actions, CI/CD pipelines |

---

## CONTENT / RESEARCH SKILLS

| Skill | Triggers |
|---|---|
| `prompt-mastery` | write prompt, improve prompt, LLM prompting |
| `strategic-compact` | context compaction, save context |
| `verification-first` | done, verify, works, before commit |
| `verification-loop` | comprehensive verification system |
| `verification-quality` | truth scoring, code quality, rollback |
| `agentic-jujutsu` | version control, quantum-resistant VCS |
| `lightpanda-browser` | scrape, browser automation, headless |

---

## LEGACY SKILLS (markdown format, from antigravity-active + single .md files)

| File | Purpose |
|---|---|
| `agentscope-patterns.md` | AgentScope multi-agent framework |
| `code-architect.md` | ADR, trade-off analysis, pattern selection |
| `code-evaluator.md` | Code review, quality assessment |
| `data-analyst.md` | Data analysis, CSV, metrics |
| `file-generator.md` | Template/config/scaffold generation |
| `frontend-designer.md` | Frontend design patterns |
| `humanizer.md` | Writing, blog, copy, content |
| `lightpanda-browser.md` | Browser automation |
| `prompt-architect.md` | Prompt design, agent workflows |
| `refactor-engine.md` | Refactoring, dead code cleanup |
| `repo-analyst.md` | Repo analysis, codebase understanding |
| `research-assistant.md` | Research, literature review |
| `ui-ux-promax.md` | UI/UX design, React components |

---

## QUICK REFERENCE — MOST USED

```
Task → Skill
─────────────────────────────────────
Code review → verification-first + code-evaluator
New feature → tdd-mastery → verification-first
Bug fix → verification-first (after fix)
Prompt writing → prompt-mastery
API design → api-design-patterns
Database → database-optimization
NLP/ML → (connect VPN) → hugging-face-model-trainer
RAG/Embeddings → agentdb-vector-search
Multi-agent → swarm-orchestration
Security check → security-review
Monitoring → monitoring-observability
```

---

## HOW SKILLS WORK IN KUSH'S CODE

Since we run the official Claude Code CLI binary, all skills in `~/.claude/skills/` are
automatically available in every session — same as regular Claude Code.

Use skills by:
1. Mentioning them in conversation ("Use tdd-mastery to...")
2. Using slash commands that trigger them
3. They auto-load when task keywords match (CLAUDE.md skill table)

For Ollama (small models): skills that require deep reasoning work better on 32b A100.
For 1.5b: use simpler skills (verification-first, tdd-mastery basics, code-evaluator).
