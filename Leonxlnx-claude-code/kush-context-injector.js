/**
 * kush-context-injector.js
 *
 * Reads the kush-brain/ directory and injects the right context
 * into the environment before launching the CLI.
 *
 * Strategy:
 *   - 1.5b model → load system-prompt-mini.md (compact)
 *   - 7b+ model  → load system-prompt.md (full)
 *   - Always compile: active rules + skill index header
 *   - Respect Ollama OLLAMA_NUM_CTX limit
 */

"use strict";

const fs   = require("node:fs");
const path = require("node:path");

const BRAIN_DIR   = path.join(__dirname, "..", "kush-brain");
const RULES_DIR   = path.join(require("node:os").homedir(), ".claude", "rules");
const SKILLS_DIR  = path.join(require("node:os").homedir(), ".claude", "skills");

/**
 * Detect model size tier from model name string.
 * Returns: 'mini' | 'mid' | 'full'
 */
function detectTier(modelName) {
  const m = (modelName || "").toLowerCase();
  if (m.includes("1.5b") || m.includes("0.5b") || m.includes("1b:") || m.endsWith(":1b")) {
    return "mini";
  }
  if (m.includes("7b") || m.includes("8b") || m.includes("3b")) {
    return "mid";
  }
  // 14b, 32b, 70b etc
  return "full";
}

/**
 * Read a file safely — returns empty string on error.
 */
function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

/**
 * Truncate text to approximately maxTokens (1 token ≈ 4 chars).
 */
function truncate(text, maxTokens) {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n\n[... truncated to fit context window ...]";
}

/**
 * Build the injected system prompt based on model tier.
 * Returns a string to set as KUSH_SYSTEM_CONTEXT env var.
 */
function buildContext(env) {
  const model     = env.OLLAMA_MODEL || "unknown";
  const tier      = detectTier(model);
  const numCtx    = parseInt(env.OLLAMA_NUM_CTX || "8192", 10);

  // Reserve 30% for output and conversation history
  const budgetTokens = Math.floor(numCtx * 0.35);

  let parts = [];

  // 1. System prompt
  const promptFile = tier === "mini"
    ? path.join(BRAIN_DIR, "system-prompt-mini.md")
    : path.join(BRAIN_DIR, "system-prompt.md");
  const sysPrompt = safeRead(promptFile);
  if (sysPrompt) parts.push(sysPrompt);

  // 2. For full/mid tier: inject compiled rules header
  if (tier !== "mini") {
    const rules = safeRead(path.join(BRAIN_DIR, "rules-compiled.md"));
    if (rules) {
      // Only inject the most critical sections for mid tier
      if (tier === "mid") {
        const criticalRules = extractSection(rules, "## CODING STYLE", "## SECURITY");
        parts.push(criticalRules);
      } else {
        parts.push(truncate(rules, Math.floor(budgetTokens * 0.4)));
      }
    }
  }

  // 3. Skills quick-reference (always — but condensed)
  const skillsRef = buildSkillsQuickRef();
  if (skillsRef) parts.push(skillsRef);

  const combined = parts.join("\n\n---\n\n");
  return truncate(combined, budgetTokens);
}

/**
 * Extract a section from markdown between two headings.
 */
function extractSection(text, startHeading, endHeading) {
  const startIdx = text.indexOf(startHeading);
  if (startIdx === -1) return "";
  const endIdx = endHeading ? text.indexOf(endHeading, startIdx + startHeading.length) : -1;
  return endIdx !== -1
    ? text.slice(startIdx, endIdx).trim()
    : text.slice(startIdx).trim();
}

/**
 * Build a compact skills quick-reference from available skills.
 */
function buildSkillsQuickRef() {
  if (!fs.existsSync(SKILLS_DIR)) return "";

  const entries = fs.readdirSync(SKILLS_DIR).slice(0, 40); // cap at 40
  const lines   = ["## Available Skills (load by mentioning name)"];

  for (const entry of entries) {
    const metaPath = path.join(SKILLS_DIR, entry, "SKILL.md");
    const mdPath   = path.join(SKILLS_DIR, entry + ".md");

    let desc = "";
    if (fs.existsSync(metaPath)) {
      const content = safeRead(metaPath);
      const match   = content.match(/^description:\s*(.+)$/m);
      desc          = match ? match[1].trim() : "";
    } else if (fs.existsSync(mdPath)) {
      const content = safeRead(mdPath);
      const match   = content.match(/^description:\s*(.+)$/m);
      desc          = match ? match[1].trim() : "";
    }

    const name = entry.replace(/\.md$/, "");
    lines.push(desc ? `- **${name}**: ${desc}` : `- **${name}**`);
  }

  return lines.join("\n");
}

/**
 * Print context summary to stderr (for launcher to log).
 */
function logSummary(model, tier, contextLength) {
  process.stderr.write(
    `  [kush-context] model=${model} tier=${tier} context_chars=${contextLength}\n`
  );
}

/**
 * Main export: inject context into env object (mutates env in place).
 */
function injectContext(env) {
  const model   = env.OLLAMA_MODEL || "unknown";
  const tier    = detectTier(model);
  const context = buildContext(env);

  // Claude Code reads CLAUDE_CODE_SYSTEM_PROMPT for additional system prompt injection
  // This appends to (not replaces) the built-in system prompt
  if (context) {
    env.CLAUDE_CODE_SYSTEM_PROMPT = context;
  }

  logSummary(model, tier, context.length);
  return env;
}

module.exports = { injectContext, detectTier, buildContext };
