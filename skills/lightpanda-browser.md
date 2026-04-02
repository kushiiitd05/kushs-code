---
name: lightpanda-browser
description: Ultra-fast headless browser for AI agents and scraping. 11x faster than Chrome, 9x less memory. Use instead of Playwright/Puppeteer Chrome for automation tasks.
---

# LightPanda Browser

## What It Is
Headless browser built in Zig from scratch (NOT a Chrome fork). Designed for AI agents.
- **11x faster** than Chrome · **9x less memory** — critical on 8GB Mac
- CDP-compatible: works with Playwright/Puppeteer scripts unchanged
- Binary: `~/lightpanda`

## When to Use
- Web scraping, research automation, testing
- Any task using playwright/puppeteer MCP — route through LightPanda for speed
- Memory-constrained tasks on Mac M2 (saves ~9x RAM vs Chrome)

## Usage

### Start CDP server
```bash
~/lightpanda serve --host 127.0.0.1 --port 9222
```

### Connect Playwright (drop-in replacement)
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("ws://127.0.0.1:9222")
    page = browser.new_page()
    page.goto("https://example.com")
    print(page.title())
    browser.close()
```

### Connect Puppeteer
```javascript
const puppeteer = require('puppeteer-core');
const browser = await puppeteer.connect({
  browserWSEndpoint: 'ws://127.0.0.1:9222'
});
```

## Limitations (Beta)
- Partial Web API coverage — complex SPAs may fail
- Use Chrome fallback for sites that break

## Integration with MCP
When playwright/puppeteer MCP tasks run, start LightPanda first:
```bash
~/lightpanda serve --host 127.0.0.1 --port 9222 &
# Then run your playwright automation
```
