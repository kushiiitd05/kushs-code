---
name: kush-ollama-optimizer
description: Optimize task decomposition and prompts for smaller Ollama models (1.5b-7b). Breaks complex tasks into atomic steps, compresses context, routes heavy tasks to A100. Use when working with Kush's Code local model.
---

# Kush Ollama Optimizer

## When to Use
- Running on qwen2.5-coder:1.5b or 7b locally
- Task seems too complex for the current model
- Response quality is degrading (hallucinations, loops)
- Context window filling up

## Core Strategy: Atomic Task Decomposition

Break ANY complex task into steps where each step:
- Has ONE clear output
- Fits in < 2000 tokens of context
- Can be verified immediately after

### Pattern
```
BAD (too broad for 1.5b):
"Refactor the authentication system to use JWT and add OAuth2 support"

GOOD (atomic steps):
Step 1: "Read auth/auth.py and list all functions (just names + line numbers)"
Step 2: "Show me the login() function only"
Step 3: "Add JWT token generation to login() — keep everything else identical"
Step 4: "Write a test for the JWT part only"
```

## Context Compression Techniques

### Before sending to 1.5b model:
1. Strip comments from code (they eat context)
2. Show only the relevant function, not the whole file
3. Give explicit output format: "Output ONLY the modified function"
4. Use code templates rather than full generation

### Context Slot Budget for 1.5b (8K context):
```
System prompt: ~500 tokens
File content:  ~2000 tokens max (show relevant parts only)
Task:          ~200 tokens
Expected output: ~2000 tokens
Buffer:        ~3300 tokens
```

## Routing Decision Tree

```
Task complexity?
├── Simple (1 file, clear spec) → 1.5b local, proceed
├── Medium (2-3 files, some reasoning) → 7b if available, else decompose for 1.5b
└── Complex (multi-file, architecture, NLP/ML) → Route to A100
    └── "Connect VPN (FortiClient, IIITD) to use qwen2.5-coder:32b"
    └── Run: kush-a100 (from terminal)
```

## Signs the Model is Struggling (switch to A100)

- Repeating the same code in a loop
- Ignoring file context you provided
- Generating incorrect function signatures
- Hallucinating imports that don't exist
- Response cuts off mid-code

## Prompt Templates for 1.5b

### Code Generation
```
File: {filename}
Function to modify: {function_name}

Current code:
```python
{ONLY the relevant function, not the whole file}
```

Task: {ONE specific change}
Output: ONLY the modified function. No explanation.
```

### Code Review
```
Code:
```{language}
{code snippet, max 50 lines}
```

List: bugs, security issues, style problems. One bullet per issue. No prose.
```

### Explanation
```
Code:
```{language}
{code}
```
Explain in 3 bullets. Max 1 sentence each.
```

## A100 Switch Command

When routing to A100:
1. Tell user: "This task needs the 32b model. Please connect FortiClient VPN."
2. User runs: `kush-a100` in a new terminal (or restart with `--provider ollama-a100`)
3. Server: YOUR_GPU_SERVER_IP | Model: qwen2.5-coder:32b | Context: 16384 tokens
