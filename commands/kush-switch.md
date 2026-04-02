# /kush-switch — Switch Kush's Code Model Backend

Switch between Ollama local (1.5b), Ollama A100 (32b), or Anthropic cloud.

## Usage
`/kush-switch` — shows options and switches

## What it does

Show the user this menu and guide them:

```
Kush's Code — Model Switch
══════════════════════════

Current: [check OLLAMA_MODEL env or say "unknown"]

Options:
  1. Ollama LOCAL  → qwen2.5-coder:1.5b (this Mac, instant start)
     → Run in terminal: kush
     → Best for: boilerplate, simple fixes, quick completions

  2. Ollama A100   → qwen2.5-coder:32b (GPU server, VPN required)
     → Steps: Connect FortiClient VPN (IIITD) → run: kush-a100
     → Best for: complex refactors, multi-file tasks, reasoning

  3. Anthropic     → Claude Sonnet 4.6 (cloud API)
     → Run: kush-cloud
     → Best for: hardest problems, architecture, novel algorithms
     → Requires: ANTHROPIC_API_KEY in ~/Projects/kushs-code/.env

Routing guide:
  Simple task (1 file) → LOCAL
  3+ files, reasoning  → A100
  NLP/ML training      → A100 (mandatory)
  Novel problem        → Anthropic
```

Ask the user which they want, then give the exact command to run.

If they say A100: remind them to connect FortiClient VPN first.
If they say Anthropic: check if ANTHROPIC_API_KEY is set and warn if not.
