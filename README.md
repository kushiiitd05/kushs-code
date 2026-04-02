<div align="center">

# 🔥 Kush's Code

**A fully local, Ollama-powered AI coding assistant built on the Claude Code engine.**

*Same power as Claude Code. Zero cloud dependency. Runs on your machine.*

[![Made by kushiiitd05](https://img.shields.io/badge/made%20by-kushiiitd05-blueviolet?style=for-the-badge)](https://github.com/kushiiitd05)
[![Powered by Ollama](https://img.shields.io/badge/powered%20by-Ollama-black?style=for-the-badge)](https://ollama.com)
[![Engine](https://img.shields.io/badge/engine-Claude%20Code%20v2.1.87-orange?style=for-the-badge)](https://claude.ai/code)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## What is Kush's Code?

Kush's Code runs the full **Claude Code CLI engine** but routes all model calls through **Ollama** — completely offline, zero cost, your code stays private.

```
kush  →  Claude Code Engine  →  Local Proxy :8792  →  Ollama  →  Your Machine
```

Built by deep-analyzing 5 Claude Code source repos and stacking the full skill/agent brain on top.

---

## Features

| | |
|---|---|
| **40 built-in tools** | File I/O, Bash, Glob, Grep, Web, MCP, Agent spawning |
| **64 skills** | TDD, RAG, NLP, security review, swarm orchestration + 2 Kush-specific |
| **72 agents** | nlp-engineer, llm-architect, ui-designer, tdd-guide, and more |
| **3 model tiers** | `kush` (1.5b local) → `kush-a100` (32b GPU) → `kush-cloud` (Anthropic) |
| **Full MCP** | filesystem, git, memory, playwright, sqlite, context7, duckduckgo, mem0 |
| **Smart context** | System prompt auto-sized per model (mini/mid/full) |
| **Zero cost** | Runs 100% locally — no API keys required |

---

## Architecture

From analyzing 5 repos (soufianebouaddis, Kuberwastaken, instructkr, 777genius, Leonxlnx):

```
Agent Loop:   plan → think → act → observe → reflect → done
Speculative:  read-only tools start DURING model streaming
Compression:  Snip → Microcompact → Collapse → Autocompact (4 tiers)
Parallel:     Glob + Grep + Read run simultaneously
Reflection:   self-critique every 3 iterations
Routing:      1.5b → 32b → cloud based on task complexity
```

---

## Install

```bash
# 1. Clone
git clone https://github.com/kushiiitd05/kushs-code
cd kushs-code

# 2. Install deps
npm install && cd Leonxlnx-claude-code && npm install && cd ..

# 3. Pull model
ollama pull qwen2.5-coder:1.5b

# 4. Add aliases
echo 'alias kush="node ~/kushs-code/Leonxlnx-claude-code/kush-launcher.js"' >> ~/.zshrc
echo 'alias kush-a100="node ~/kushs-code/Leonxlnx-claude-code/kush-launcher.js --provider ollama-a100"' >> ~/.zshrc
echo 'alias kush-cloud="node ~/kushs-code/Leonxlnx-claude-code/kush-launcher.js --provider anthropic"' >> ~/.zshrc
source ~/.zshrc
```

---

## Run

**Terminal 1 — proxy (keep open):**
```bash
cd kushs-code
npm run proxy:ollama
```

**Terminal 2 — launch:**
```bash
kush
```

---

## Commands

| Command | Model | Best for |
|---|---|---|
| `kush` | qwen2.5-coder:1.5b local | Simple tasks, boilerplate, quick fixes |
| `kush-a100` | qwen2.5-coder:32b GPU server | Complex reasoning, multi-file tasks |
| `kush-cloud` | Claude Sonnet (Anthropic) | Hardest problems, novel algorithms |

Inside session: `/kush-switch` to get routing guide.

---

## Project Structure

```
kushs-code/
├── CLAUDE.md                        # Project brain (skill table, agent loop, rules)
├── kush-brain/
│   ├── system-prompt.md             # Full system prompt (32b)
│   ├── system-prompt-mini.md        # Compact prompt (1.5b)
│   ├── rules-compiled.md            # All rules compiled
│   ├── skills-index.md              # 64 skills indexed
│   ├── agents-index.md              # 72 agents indexed
│   └── power-roles.md               # Role prompts (reviewer, planner, TDD)
├── Leonxlnx-claude-code/
│   ├── kush-launcher.js             # Smart Ollama-first launcher
│   ├── kush-patch-branding.js       # Branding patch
│   ├── kush-context-injector.js     # System prompt builder per model tier
│   └── package/cli.js               # Claude Code CLI engine v2.1.87
└── src/
    └── ollamaCompatProxy.ts         # Ollama compatibility proxy
```

---

## Why?

Claude Code costs money and sends your code to the cloud.  
Kush's Code gives you the same agentic coding interface — **free, local, private, forever.**

---

## Credits

- Engine: [Anthropic Claude Code](https://claude.ai/code) v2.1.87
- Proxy base: [Leonxlnx/claw-dev](https://github.com/Leonxlnx/claw-dev)
- Built by: **kushiiitd05** — IIIT Delhi · NLP/AI

---

<div align="center"><sub>Local AI. Zero cost. Full power. 🔥</sub></div>
