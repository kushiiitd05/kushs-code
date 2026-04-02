/**
 * kush-patch-branding.js
 * Patches the compiled Claude Code CLI bundle with "Kush's Code" branding.
 * Run once — subsequent runs are idempotent (detects already-patched bundles).
 */

const fs = require("node:fs");
const path = require("node:path");

const cliPath = path.join(__dirname, "package", "cli.js");

if (!fs.existsSync(cliPath)) {
  console.error(`Bundle not found: ${cliPath}`);
  process.exit(1);
}

let source = fs.readFileSync(cliPath, "utf8");
const original = source;

const replacements = [
  // Core name replacements
  ["Welcome to Claude Code", "Welcome to Kush's Code"],
  ["Welcome to Claw Dev",    "Welcome to Kush's Code"],
  ["Claude Code",            "Kush's Code"],
  ["Claw Dev",               "Kush's Code"],

  // Model slot labels
  [
    "Switch between Claude models. Applies to this session and future Claude Code sessions. For other/previous model names, specify with --model.",
    "Switch between models. Applies to this session and future Kush's Code sessions. Specify custom model names with --model.",
  ],
  [
    "Switch between available models. Applies to this session and future Claw Dev sessions. For other or custom model names, specify with --model.",
    "Switch between models. Applies to this session and future Kush's Code sessions. Specify custom model names with --model.",
  ],
  ["Claude Opus 4.6",  "Kush Opus Slot"],
  ["Claude Sonnet 4.6","Kush Sonnet Slot"],
  ["Claude Haiku 4.5", "Kush Haiku Slot"],
  ["Opus Slot",        "Kush Opus Slot"],
  ["Sonnet Slot",      "Kush Sonnet Slot"],
  ["Haiku Slot",       "Kush Haiku Slot"],
  ["Opus 4.6",         "Kush Opus"],
  ["Sonnet 4.6",       "Kush Sonnet"],
  ["Haiku 4.5",        "Kush Haiku"],
  ["Sonnet 4.5",       "Kush Sonnet"],
  ["Sonnet 4",         "Kush Sonnet"],
  ["Opus 4.1",         "Kush Opus"],

  // Installer notice
  [
    "Claude Code has switched from npm to native installer. Run `claude install` or see https://docs.anthropic.com/en/docs/claude-code/getting-started",
    "Kush's Code is running via local Ollama. Run `kush` to start.",
  ],
  [
    "Kush's Code is running through the local multi-provider launcher.",
    "Kush's Code is running via local Ollama. Run `kush` to start.",
  ],

  // ASCII art mascot → KUSH branding
  ["▛███▜", "KUSHS"],
  ["▟███▟", "KUSHS"],
  ["▙███▙", "KUSHS"],
  ["█████", " CODE"],
  ["▘▘ ▝▝", "     "],
  [" █████████ ", "  KUSHCODE "],
  ["██▄█████▄██", " [KUSHCODE]"],
  ["█ █   █ █",  " KUSH CODE "],
  ["CLAWD",      "KUSH "],
  [" DEV ",      " CODE"],
  ["[CLAWDEV]",  "[KUSHCODE]"],
  ["CLAW DEV",   "KUSH CODE"],
  ["CLAWDEV",    "KUSHCODE"],
];

for (const [from, to] of replacements) {
  source = source.split(from).join(to);
}

if (source !== original) {
  fs.writeFileSync(cliPath, source, "utf8");
  console.log("✓ Applied Kush's Code branding patch.");
} else {
  console.log("✓ Branding already applied — nothing to change.");
}
