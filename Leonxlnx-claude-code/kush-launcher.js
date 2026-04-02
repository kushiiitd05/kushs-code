#!/usr/bin/env node
/**
 * kush-launcher.js — Kush's Code smart launcher
 *
 * Defaults to Ollama (local qwen2.5-coder:1.5b).
 * One-key switch to A100 server (VPN required) or Anthropic fallback.
 *
 * Usage:
 *   node kush-launcher.js              # Ollama local (default)
 *   node kush-launcher.js --provider ollama-a100   # A100 server
 *   node kush-launcher.js --provider anthropic     # Claude API
 *   node kush-launcher.js --model qwen3            # override model
 */

"use strict";

const fs   = require("node:fs");
const http = require("node:http");
const net  = require("node:net");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { spawn }      = require("node:child_process");
const readline       = require("node:readline/promises");
const { injectContext } = require("./kush-context-injector");

const repoRoot     = __dirname;
const workspaceRoot = path.dirname(repoRoot);

// Load .env
require("dotenv").config({ path: path.join(workspaceRoot, ".env") });

const cliPath          = path.join(repoRoot, "package", "cli.js");
const brandingPatchPath = path.join(repoRoot, "kush-patch-branding.js");

// Proxy port for Ollama compat shim (from claw-dev)
const OLLAMA_PROXY_PORT = process.env.ANTHROPIC_COMPAT_PORT || "8792";

// ── Banner ────────────────────────────────────────────────────────────────────

function showBanner(provider, model) {
  const line = "─".repeat(52);
  console.log(`\n╔${line}╗`);
  console.log(`║  🔥  KUSH'S CODE — AI Coding Assistant            ║`);
  console.log(`║  Provider : ${pad(provider, 39)}║`);
  console.log(`║  Model    : ${pad(model,    39)}║`);
  console.log(`╚${line}╝\n`);
}

function pad(s, n) {
  return String(s).padEnd(n);
}

// ── Arg parsing ───────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const forward = [];
  let provider = null;
  let model    = null;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--provider") { provider = argv[++i]; continue; }
    if (argv[i] === "--model")    { model    = argv[++i]; continue; }
    forward.push(argv[i]);
  }
  return { provider, model, forward };
}

function isInfoOnly(args) {
  return args.includes("--version") || args.includes("-v") ||
         args.includes("--help")    || args.includes("-h");
}

// ── Provider resolution ───────────────────────────────────────────────────────

const PROVIDERS = {
  "ollama":      { label: "Ollama (local)",         mode: "proxy" },
  "ollama-a100": { label: "Ollama A100 (VPN)",       mode: "proxy-a100" },
  "anthropic":   { label: "Anthropic Claude API",    mode: "direct" },
};

async function resolveProvider(rl, arg, forward) {
  // Info-only flags — don't need a provider
  if (isInfoOnly(forward)) return "anthropic";

  // Env or arg override
  const preset = (arg || process.env.CLAW_PROVIDER || "ollama").trim().toLowerCase();
  if (PROVIDERS[preset]) return preset;

  // Interactive menu
  console.log("\nKush's Code — choose your backend:\n");
  console.log("  1. Ollama local      (qwen2.5-coder:1.5b on this Mac)");
  console.log("  2. Ollama A100       (qwen2.5-coder:32b on GPU server — VPN required)");
  console.log("  3. Anthropic Claude  (cloud API — needs ANTHROPIC_API_KEY)\n");

  const answer = (await rl.question("Choose [1]: ")).trim() || "1";
  return { "1": "ollama", "2": "ollama-a100", "3": "anthropic" }[answer] || "ollama";
}

// ── Ollama health check ───────────────────────────────────────────────────────

function checkOllama(baseUrl) {
  return new Promise((resolve) => {
    const url = new URL("/api/tags", baseUrl);
    const req = http.get({ host: url.hostname, port: url.port || 11434, path: url.pathname }, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on("error", () => resolve(false));
    req.setTimeout(3000, () => { req.destroy(); resolve(false); });
  });
}

// ── Proxy port check / wait ───────────────────────────────────────────────────

function isPortOpen(port) {
  return new Promise((resolve) => {
    const s = net.createConnection({ port: parseInt(port), host: "127.0.0.1" });
    s.once("connect", () => { s.destroy(); resolve(true); });
    s.once("error",   () => resolve(false));
    s.setTimeout(500, () => { s.destroy(); resolve(false); });
  });
}

async function waitForPort(port, maxWaitMs = 12000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    if (await isPortOpen(port)) return true;
    await new Promise(r => setTimeout(r, 250));
  }
  return false;
}

// ── Launch the bundled CLI ─────────────────────────────────────────────────────

function launchCli(env, forwardArgs) {
  if (!fs.existsSync(cliPath)) {
    console.error(`\n✗  Bundle not found: ${cliPath}`);
    console.error("   Run: cd Leonxlnx-claude-code && npm install\n");
    process.exit(1);
  }

  const child = spawn(process.execPath, [cliPath, ...forwardArgs], {
    stdio: "inherit",
    env,
  });

  child.on("exit", (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });

  process.on("SIGINT",  () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));
}

// ── Ollama proxy launcher (reuses claw-dev's built-in proxy) ─────────────────

let proxyProcess = null;

async function ensureOllamaProxy(env) {
  if (await isPortOpen(OLLAMA_PROXY_PORT)) {
    return; // already running
  }

  // Find the claw-dev-launcher which starts the built-in proxy
  const proxyScript = path.join(repoRoot, "claw-dev-launcher.js");
  if (!fs.existsSync(proxyScript)) {
    console.error("✗  Cannot find claw-dev-launcher.js to start Ollama proxy.");
    process.exit(1);
  }

  // Start the proxy in background using the same Node that runs us
  proxyProcess = spawn(process.execPath, [proxyScript, "--provider", "ollama", "--no-interactive"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...env, CLAW_PROXY_ONLY: "1" },
    detached: false,
  });

  proxyProcess.stdout?.on("data", d => {
    const line = d.toString().trim();
    if (line) process.stderr.write(`  [proxy] ${line}\n`);
  });
  proxyProcess.stderr?.on("data", d => {
    const line = d.toString().trim();
    if (line && !line.includes("ExperimentalWarning")) process.stderr.write(`  [proxy] ${line}\n`);
  });

  process.on("exit", () => proxyProcess?.kill());

  const up = await waitForPort(OLLAMA_PROXY_PORT, 15000);
  if (!up) {
    console.error("\n✗  Ollama compatibility proxy did not start in time.");
    console.error("   Is Ollama running? Try: ollama serve\n");
    process.exit(1);
  }
}

// ── Model priming (helps the bundled model picker show our models) ────────────

function primeModelCache(env, models, mainModel) {
  const cacheDir  = path.join(repoRoot, ".model-picker-cache");
  const cacheFile = path.join(cacheDir, "available-models.json");
  try {
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify({ models, selected: mainModel }, null, 2));
  } catch { /* non-fatal */ }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Apply Kush's Code branding
  if (fs.existsSync(brandingPatchPath)) {
    require(brandingPatchPath);
  }

  const { provider: providerArg, model: modelArg, forward } = parseArgs(process.argv.slice(2));

  // Info-only flags (--version, --help) → pass straight through, no provider needed
  if (isInfoOnly(forward)) {
    return launchCli({ ...process.env }, forward);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    const provider = await resolveProvider(rl, providerArg, forward);
    const env = { ...process.env };

    // ── Anthropic direct ──────────────────────────────────────────────────────
    if (provider === "anthropic") {
      const key = env.ANTHROPIC_API_KEY?.trim();
      if (!key || key === "your_anthropic_api_key_here") {
        console.error("\n✗  ANTHROPIC_API_KEY not set in .env\n");
        console.error("   Edit ~/Projects/kushs-code/.env and add your key\n");
        process.exit(1);
      }
      const model = modelArg || env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
      showBanner("Anthropic Claude API", model);
      env.ANTHROPIC_MODEL = model;
      launchCli(env, forward);
      return;
    }

    // ── Ollama (local or A100) ─────────────────────────────────────────────────
    let ollamaBase, ollamaModel, ollamaModels;

    if (provider === "ollama-a100") {
      ollamaBase   = "http://YOUR_GPU_SERVER_IP:11434";
      ollamaModel  = modelArg || "qwen2.5-coder:32b";
      ollamaModels = "qwen2.5-coder:32b,qwen2.5-coder:14b,qwen2.5-coder:7b";
      console.log("\n⚡  Using A100 GPU server — make sure FortiClient VPN is connected!\n");
    } else {
      ollamaBase   = env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
      ollamaModel  = modelArg || env.OLLAMA_MODEL || "qwen2.5-coder:1.5b";
      ollamaModels = env.OLLAMA_MODELS || "qwen2.5-coder:1.5b,qwen3:latest";
    }

    // Check Ollama is actually running
    const ollamaAlive = await checkOllama(ollamaBase);
    if (!ollamaAlive) {
      console.error(`\n✗  Ollama not reachable at ${ollamaBase}`);
      console.error("   Start it with: ollama serve");
      if (provider === "ollama-a100") {
        console.error("   Also verify FortiClient VPN is connected to IIITD\n");
      }
      process.exit(1);
    }

    showBanner(provider === "ollama-a100" ? "Ollama A100 — " + ollamaBase : "Ollama local — " + ollamaBase, ollamaModel);

    // Set env vars the proxy will pick up
    env.OLLAMA_BASE_URL    = ollamaBase;
    env.OLLAMA_MODEL       = ollamaModel;
    env.OLLAMA_MODELS      = ollamaModels;
    env.OLLAMA_NUM_CTX     = provider === "ollama-a100" ? "16384" : (env.OLLAMA_NUM_CTX || "8192");
    env.OLLAMA_NUM_PREDICT = provider === "ollama-a100" ? "4096"  : (env.OLLAMA_NUM_PREDICT || "2048");
    env.OLLAMA_KEEP_ALIVE  = env.OLLAMA_KEEP_ALIVE || "30m";

    // Prime model picker cache
    primeModelCache(env, ollamaModels.split(","), ollamaModel);

    // Inject Kush's Code context (system prompt, rules, skills)
    injectContext(env);

    // Start the Ollama proxy shim (translates Anthropic → Ollama)
    console.log("  Starting Ollama compatibility proxy...");
    await ensureOllamaProxy(env);
    console.log(`  ✓ Proxy ready on port ${OLLAMA_PROXY_PORT}\n`);

    // Point the Claude Code CLI at our local proxy
    env.ANTHROPIC_BASE_URL  = `http://127.0.0.1:${OLLAMA_PROXY_PORT}`;
    env.ANTHROPIC_AUTH_TOKEN = `kushscode-${randomUUID()}`;
    delete env.ANTHROPIC_API_KEY;

    launchCli(env, forward);

  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error("\n✗  Kush's Code launcher error:", err.message || err);
  process.exit(1);
});
