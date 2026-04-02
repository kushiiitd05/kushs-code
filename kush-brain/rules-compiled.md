# Kush's Code — Compiled Rules
> All rules from ~/.claude/rules/ compiled into one reference file
> Source: coding-style.md, security.md, testing.md, development-workflow.md, performance.md, agents.md, patterns.md

---

## CODING STYLE

### Immutability (CRITICAL)
- ALWAYS return new objects, NEVER mutate existing ones
- Wrong: `modify(obj, field, val)` — changes original in-place
- Correct: `update(obj, field, val)` — returns new copy with change

### File Organization
- 200-400 lines typical, **800 max** — extract when bigger
- High cohesion, low coupling
- Organize by feature/domain, NOT by type (not /models/, /controllers/ etc.)

### Error Handling
- Handle errors explicitly at EVERY level
- User-facing code: friendly messages
- Server/internal: detailed context in logs
- NEVER silently swallow errors

### Input Validation
- Validate at ALL system boundaries: user input, API responses, file content
- Use schema-based validation (Zod, Pydantic, etc.)
- Fail fast with clear messages

### Code Quality Checklist
- [ ] Readable, well-named — no abbreviations
- [ ] Functions < 50 lines
- [ ] Files < 800 lines
- [ ] No deep nesting (>4 levels)
- [ ] Explicit error handling at each layer
- [ ] No hardcoded values — constants or config
- [ ] No mutation — immutable patterns

---

## SECURITY

### Pre-Commit Checklist (MANDATORY)
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated
- [ ] SQL injection prevention (parameterized queries only)
- [ ] XSS prevention (sanitized HTML)
- [ ] CSRF protection enabled
- [ ] Auth/authorization verified
- [ ] Rate limiting on endpoints
- [ ] Error messages don't leak internals

### Secret Management
- NEVER hardcode secrets in source
- ALWAYS use env vars or secret manager
- Validate required secrets present at startup
- Rotate any exposed secrets immediately

### Security Response Protocol
1. STOP immediately if security issue found
2. Fix CRITICAL before continuing
3. Rotate any exposed secrets
4. Review entire codebase for similar issues

---

## TESTING

### Minimum Coverage: 80%

Three test types required:
1. **Unit** — individual functions, utilities, components
2. **Integration** — API endpoints, database operations
3. **E2E** — critical user flows

### TDD Workflow (MANDATORY)
1. Write test first (RED — it must FAIL)
2. Write minimal implementation (GREEN — test passes)
3. Refactor (IMPROVE — keep tests green)
4. Verify 80%+ coverage

### Test Naming
- `test_<unit>_<scenario>_<expected_result>`
- `it("should <behavior> when <condition>")`

### Arrange-Act-Assert Pattern
```
Arrange: set up test data + dependencies
Act:     execute behavior under test
Assert:  verify expected outcome
```

---

## DEVELOPMENT WORKFLOW

0. **Research first** (MANDATORY before any new implementation)
   - GitHub code search for existing implementations
   - Library docs (context7 MCP)
   - Package registries (npm, PyPI) before hand-rolling

1. **Plan** — create typed JSON plan:
   ```json
   { "steps": [], "risks": [], "successCriteria": [] }
   ```

2. **TDD** — test first, implement, refactor

3. **Code Review** — check security + coding style checklist

4. **Commit** — conventional commits format

---

## PERFORMANCE & MODEL SELECTION

| Model | Use For |
|---|---|
| qwen2.5-coder:1.5b (local) | Boilerplate, simple functions, quick snippets |
| qwen2.5-coder:32b (A100) | Complex logic, multi-file refactoring, NLP/ML |
| Anthropic Claude Sonnet | Cloud fallback when local insufficient |

### Context Window Rules
- For 1.5b: give ONE task at a time, full file context upfront
- For 32b: can handle multi-turn complex reasoning
- Don't dump entire codebase into context — use Glob/Grep to find specific files

### Speculative Execution (from claw-dev source)
- Start read-only tool calls IMMEDIATELY — don't wait for previous to finish
- Run Glob + Grep + Read in PARALLEL when independent
- Cache results: don't repeat identical reads in same session

---

## AGENT ORCHESTRATION

### Use Agents Immediately For:
- Complex feature requests → `planner` agent first
- Code just written → `code-reviewer` agent
- Bug fix or new feature → `tdd-guide` agent
- Architectural decision → `architect` agent + sequential-thinking MCP

### Parallel Execution (ALWAYS for independent ops)
```
GOOD: Launch in parallel:
  1. Security analysis of auth module
  2. Performance review of cache
  3. Type checking utilities

BAD: Sequential when not needed
```

---

## PATTERNS

### Repository Pattern
- Define standard ops: findAll, findById, create, update, delete
- Concrete implementations handle storage (DB, API, file)
- Business logic depends on abstract interface, not storage

### API Response Format
```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "total": 0, "page": 1, "limit": 20 }
}
```

### Skeleton Projects
Before implementing new functionality:
1. Search GitHub for battle-tested implementations
2. Evaluate: security, extensibility, relevance
3. Clone best match as foundation
4. Iterate within proven structure

---

## GIT WORKFLOW

### Commit Format
```
<type>: <description>

<optional body explaining why>
```
Types: `feat` `fix` `refactor` `docs` `test` `chore` `perf` `ci`

### PR Workflow
1. Analyze full commit history (not just latest)
2. `git diff [base-branch]...HEAD` for all changes
3. Comprehensive summary with test plan
4. Push with `-u` flag for new branches
