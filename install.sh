#!/usr/bin/env bash
# ============================================================
# Kush's Code — Full Installer
# Sets up: aliases, branding patch, Ollama check, deps
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INNER_DIR="$SCRIPT_DIR/Leonxlnx-claude-code"
LAUNCHER="$INNER_DIR/kush-launcher.js"
ZSHRC="$HOME/.zshrc"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║  🔥  KUSH'S CODE — Installer                        ║${RESET}"
echo -e "${CYAN}║  Ollama-first AI coding assistant                    ║${RESET}"
echo -e "${CYAN}║  Built on Claude Code + 5-repo architecture analysis ║${RESET}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""

# ── 1. Check Node ──────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗  Node.js not found. Install: brew install node${RESET}"
  exit 1
fi
echo -e "${GREEN}✓  Node $(node --version)${RESET}"

# ── 2. Install npm deps ────────────────────────────────────────────────────────
echo "   Installing Node dependencies..."
cd "$INNER_DIR"
npm install --silent
echo -e "${GREEN}✓  Dependencies installed${RESET}"

# ── 3. Apply Kush's Code branding ─────────────────────────────────────────────
echo "   Applying Kush's Code branding patch..."
node "$INNER_DIR/kush-patch-branding.js"

# ── 4. Check Ollama ───────────────────────────────────────────────────────────
echo "   Checking Ollama..."
if command -v ollama &>/dev/null || [ -x /opt/homebrew/bin/ollama ]; then
  OLLAMA_BIN="${OLLAMA_BIN:-$(command -v ollama 2>/dev/null || echo /opt/homebrew/bin/ollama)}"
  echo -e "${GREEN}✓  Ollama found at $OLLAMA_BIN${RESET}"

  # Check if qwen2.5-coder:1.5b is pulled
  if $OLLAMA_BIN list 2>/dev/null | grep -q "qwen2.5-coder:1.5b"; then
    echo -e "${GREEN}✓  qwen2.5-coder:1.5b already pulled${RESET}"
  else
    echo -e "${YELLOW}⚠  qwen2.5-coder:1.5b not found locally${RESET}"
    echo "   To pull: ollama pull qwen2.5-coder:1.5b"
    echo "   (or start Ollama first: ollama serve)"
  fi
else
  echo -e "${YELLOW}⚠  Ollama not found in PATH. Install: brew install ollama${RESET}"
fi

# ── 5. Add shell aliases ───────────────────────────────────────────────────────
add_alias() {
  local alias_def="$1"
  local alias_name="$2"
  if grep -qF "alias $alias_name=" "$ZSHRC" 2>/dev/null; then
    # Update existing alias
    sed -i '' "s|alias $alias_name=.*|$alias_def|" "$ZSHRC"
    echo -e "${GREEN}✓  Updated alias: $alias_name${RESET}"
  else
    echo "" >> "$ZSHRC"
    echo "# Kush's Code" >> "$ZSHRC"
    echo "$alias_def" >> "$ZSHRC"
    echo -e "${GREEN}✓  Added alias: $alias_name${RESET}"
  fi
}

add_alias "alias kush='node $LAUNCHER'"                                     "kush"
add_alias "alias kush-a100='node $LAUNCHER --provider ollama-a100'"         "kush-a100"
add_alias "alias kush-cloud='node $LAUNCHER --provider anthropic'"          "kush-cloud"
add_alias "alias kush-status='curl -s http://127.0.0.1:11434/api/tags | python3 -c \"import json,sys; d=json.load(sys.stdin); [print(m[\\\"name\\\"]) for m in d.get(\\\"models\\\",[])]\"; echo OK'" "kush-status"

# ── 6. Summary ────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║  ✅  Kush's Code installed!                          ║${RESET}"
echo -e "${CYAN}║                                                      ║${RESET}"
echo -e "${CYAN}║  Commands:                                           ║${RESET}"
echo -e "${CYAN}║    kush           → Ollama local (qwen2.5-coder:1.5b)║${RESET}"
echo -e "${CYAN}║    kush-a100      → A100 32b model (VPN required)    ║${RESET}"
echo -e "${CYAN}║    kush-cloud     → Anthropic Claude API             ║${RESET}"
echo -e "${CYAN}║    kush-status    → Check Ollama models available    ║${RESET}"
echo -e "${CYAN}║                                                      ║${RESET}"
echo -e "${CYAN}║  Inside Kush's Code:                                 ║${RESET}"
echo -e "${CYAN}║    /kush-switch   → switch model backend             ║${RESET}"
echo -e "${CYAN}║    /context-save  → save session context             ║${RESET}"
echo -e "${CYAN}║    /tech-debt     → analyze tech debt                ║${RESET}"
echo -e "${CYAN}║    /ml-pipeline   → ML pipeline scaffold             ║${RESET}"
echo -e "${CYAN}║    62 skills + 72 agents available                   ║${RESET}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""
echo "  Next steps:"
echo "  1. Start Ollama:  ollama serve"
echo "  2. Pull model:    ollama pull qwen2.5-coder:1.5b"
echo "  3. Source shell:  source ~/.zshrc"
echo "  4. Launch:        kush"
echo ""
echo "  For A100 tasks: connect FortiClient VPN (IIITD) → kush-a100"
echo "  Edit config:    ~/Projects/kushs-code/.env"
echo ""
