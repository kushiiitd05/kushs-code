---
name: Verification First
description: Use before saying "done", "works", "fixed", or making any completion claim. Enforces evidence-before-claims discipline: run the verification command, read the output, THEN claim. Source: obra/superpowers v5.0.6 (40.9k stars).
---

## The Iron Gate

Before ANY status claim, run this sequence:
1. **Identify** the verification command needed
2. **Run** it completely and freshly
3. **Read** the full output and exit code
4. **Verify** output confirms the claim
5. **Only then** make the claim — with the evidence

Skipping any step is dishonesty, not efficiency.

---

## Forbidden Language (before verification)

Never say these without running a command first:
- "Should work"
- "Probably passes"
- "Seems to be fixed"
- "Great!" / "Perfect!" / "Done!"
- "The tests should pass"

Replace with: run the test. Then report the actual result.

---

## What Verification Is NOT

| Claim | What it actually proves |
|-------|------------------------|
| "Tests should pass" | Nothing |
| "I changed the code" | Nothing about correctness |
| "The linter passed" | Not that it builds |
| "Agent reports it's done" | Nothing — verify independently |

---

## Hard Rules

- Never commit without running tests
- Never push without running tests
- Never create a PR without independent verification
- After 3+ failed fix attempts: **stop patching symptoms, question the architecture**

---

## Debugging Corollary (from obra/superpowers)

**Root cause tracing** — bugs often manifest deep in call stack. Trace backward:
1. Where does the error surface?
2. What code directly causes it?
3. What called that code?
4. What values were passed?
5. Where did the original data come from?

**Defense-in-depth** — after fixing root cause, add validation at EVERY layer:
- Layer 1: Entry point (type checks, existence checks)
- Layer 2: Business logic (semantic validation)
- Layer 3: Environment guards (test vs prod)
- Layer 4: Debug instrumentation (forensic logging)

Goal: make the bug **structurally impossible**, not just fixed once.

---

## Condition-Based Waiting (not arbitrary timeouts)

Replace `sleep(2000)` with:
```typescript
await waitFor(() => getResult() !== undefined, { timeout: 5000, interval: 10 });
```
Poll every 10ms for actual condition. Timeout after 5s with descriptive error.
Result from obra/superpowers: "test reliability improved from 60% to 100%, execution time reduced 40%"
