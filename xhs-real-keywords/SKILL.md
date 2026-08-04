---
name: xhs-real-keywords
description: Collect real Xiaohongshu keyword evidence for an industry, niche, topic, or seed keyword. Use when the user wants 小红书真实搜索词, 行业关键词, 下拉词, 大家都在搜, search-result keyword maps, or evidence-backed XHS keyword research rather than guessed keywords.
---

# XHS Real Keywords

## Workflow

Use the bundled script to collect real Xiaohongshu keyword evidence from the user's seed keyword.

Default command from a normal writable workspace:

```powershell
node "<path-to-skill>\scripts\collect-xhs-keywords.mjs" --industry "新加坡留学" --depth 1 --max-seeds 1 --channel chrome --profile-dir ".cache/xhs-profile" --timeout-ms 20000
```

Replace `新加坡留学` with the user's industry or keyword.

If `playwright` is missing in the current workspace, install it there first:

```powershell
npm.cmd install playwright
npx.cmd playwright install chromium
```

Use `.cmd` variants on Windows.

## Data Sources

The script tries Xiaohongshu search suggestions first. If the current XHS PC page does not expose a visible search box, it automatically falls back to the search result page and extracts:

- `大家都在搜` terms
- search filter / refinement terms
- top result note titles and note URLs

Treat these as real platform evidence, not exact all-platform search volume.

## Output

The script writes files under `output/` unless `--out-dir` is provided:

- `xhs-keywords-*.json`: complete data, sources, note URLs, run metadata
- `xhs-keywords-*.csv`: spreadsheet-friendly keyword table
- `xhs-keywords-*.md`: readable keyword map

After running, open the newest JSON and summarize:

- total related terms
- total top notes
- total final keywords
- top 10-20 keywords with intent and source type
- the absolute output paths

Prefer JSON for reading results because PowerShell may display Chinese Markdown as mojibake even when the file is valid UTF-8.

## Recommended Options

- Start small: `--depth 1 --max-seeds 1`
- Expand after success: `--depth 2 --max-seeds 20`
- Use persistent browser state: `--profile-dir ".cache/xhs-profile"`
- If login or verification is needed: add `--startup-wait-ms 60000` and run headed
- Use Chrome on this Windows machine: `--channel chrome`

## Safety

Do not auto-publish, comment, like, follow, or modify any Xiaohongshu account state. The script only opens pages and reads visible/search-result data. It can reuse a browser profile for normal browsing state, but do not inspect or print cookies, tokens, or account credentials.

If Xiaohongshu returns an IP-risk page, login wall, empty page, or missing search results, state that collection is blocked and include the observed page state instead of inventing keywords.
