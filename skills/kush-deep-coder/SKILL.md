---
name: kush-deep-coder
description: Full-stack deep coding mode for Kush's Code. Applies ALL learnings from Claude Code architecture analysis: speculative execution, 4-tier compression, byte-identical prefix, tool caching, reflection loops, tiered model routing. Maximum capability extraction from Ollama models.
---

# Kush Deep Coder

## What This Activates
All architectural optimizations from the 5-repo Claude Code analysis:
1. Speculative execution pattern
2. Tool result caching
3. 4-tier context compression
4. Reflection loop (every 3 iterations)
5. Typed JSON planning
6. Parallel tool dispatch
7. Tiered model routing
8. Byte-identical prefix trick for sub-tasks

---

## 1. SPECULATIVE EXECUTION

Start read-only operations IMMEDIATELY — never wait sequentially:

```
When you need to understand a codebase:
WRONG (sequential, slow):
  1. Read file A
  2. (wait)
  3. Read file B
  4. (wait)
  5. Grep for pattern

CORRECT (speculative, fast):
  Launch in parallel:
  - Read file A
  - Read file B
  - Grep for pattern
  Synthesize results after all return
```

**Rule:** Any combination of Glob + Grep + Read that doesn't depend on each other = run simultaneously.

---

## 2. TOOL RESULT CACHING

Within a session — NEVER repeat the same read:

```python
# Conceptual cache (implemented mentally):
session_cache = {}

def read_file(path):
    if path in session_cache:
        return session_cache[path]  # return instantly
    result = actually_read(path)
    session_cache[path] = result
    return result
```

If you already read a file this session — use the cached content. Don't re-read it.

---

## 3. 4-TIER CONTEXT COMPRESSION

When context fills up (apply in order):

| Tier | Action | When |
|---|---|---|
| 1. Snip | Remove oldest low-signal messages (tool acks, simple confirmations) | Context > 60% |
| 2. Microcompact | Summarize middle conversation blocks | Context > 75% |
| 3. Collapse | Compress verbose tool outputs to key facts | Context > 85% |
| 4. Autocompact | Full context rebuild from extracted facts | Context > 95% |

**Tier 1 Snip example:**
```
Drop: "OK, I'll read the file..." + the ping message
Keep: The actual file content + the decision made
```

**Tier 4 Autocompact procedure:**
1. Extract all decisions made so far (bullet list)
2. Extract all files modified (file:line)
3. Extract current task state
4. Build fresh context from these facts
5. Continue with lean history

---

## 4. REFLECTION LOOP

Every 3 tool calls — pause and self-critique:

```json
{
  "complete": false,
  "correct": ["identified the bug location", "test was written first"],
  "incorrect": ["wrong assumption about API format"],
  "pivotPlan": "Check the actual API response format first",
  "nextAction": "Read the API response schema"
}
```

If `pivotPlan` is not null → revise the plan before continuing.
This prevents spiraling down the wrong path for 20+ tool calls.

---

## 5. TYPED JSON PLANNING

Before starting ANY multi-step task:

```json
{
  "task": "string description",
  "clarifications": [],
  "affectedFiles": [],
  "steps": [
    {"id": 1, "action": "Read X to understand Y", "tool": "Read"},
    {"id": 2, "action": "Grep for pattern Z", "tool": "Grep"},
    {"id": 3, "action": "Edit file A at line N", "tool": "Edit", "blockedBy": [1, 2]}
  ],
  "risks": ["overwrites existing logic at line 45"],
  "successCriteria": ["tests pass", "no TypeScript errors", "function returns correct type"]
}
```

Note `blockedBy` dependencies — steps without dependencies run in parallel.

---

## 6. PARALLEL TOOL DISPATCH

Classify every tool call:

| Class | Safety | Execution |
|---|---|---|
| `read-only` | Glob, Grep, Read | PARALLEL — all at once |
| `write` | FileWrite, FileEdit | SERIAL — one at a time |
| `destructive` | Bash rm/reset, git reset --hard | SERIAL + USER CONFIRM |
| `network` | WebFetch, WebSearch | PARALLEL among network tools |

Never run a `write` tool before all dependent `read-only` tools complete.

---

## 7. TIERED MODEL ROUTING

| Task | Route to | Command |
|---|---|---|
| Single function change | 1.5b local | `kush` (default) |
| Multi-file refactor | 32b A100 | `kush-a100` |
| NLP/ML training | A100 (VPN) | SSH to vinayak-server |
| Architecture design | Anthropic Claude | `kush-cloud` |
| Cloud fallback | Anthropic | `kush-cloud` |

**Model capability comparison:**
```
qwen2.5-coder:1.5b → ~GPT-3.5 level for code, best for: completions, formatting, simple fixes
qwen2.5-coder:32b  → ~Claude Haiku level for code, best for: reasoning, multi-file, design
Claude Sonnet      → best for: architecture, complex debugging, novel problems
```

---

## 8. BYTE-IDENTICAL PREFIX TRICK (for sub-tasks)

When spawning sub-tasks (e.g., via Agent tool):

Give ALL sub-tasks the SAME opening:
```
[Task prefix — identical for all sub-agents]
You are Kush's Code, expert coding assistant...
Working on: {exact same task description}

[Sub-task specific part — varies]
Your specific focus: {unique part here}
```

Why: The identical prefix hits the prompt cache → near-zero cost for repeated context.
95% savings on API calls when using Anthropic as fallback.

---

## HOW TO USE THIS SKILL

When activated, apply ALL 8 patterns simultaneously:
1. Plan first (JSON)
2. Dispatch reads in parallel
3. Cache all results
4. Reflect every 3 iterations
5. Compress context when needed
6. Route to right model
7. Use prefix trick for sub-tasks
8. Verify before claiming done (run verification-first)
