import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

async function loadChromium() {
  try {
    return (await import("playwright")).chromium;
  } catch {
    const requireFromCwd = createRequire(path.resolve(process.cwd(), "xhs-real-keywords.cjs"));
    return requireFromCwd("playwright").chromium;
  }
}

const TARGET_URL = "https://www.xiaohongshu.com/explore";
const SOURCE_TYPE = "xiaohongshu_search_suggestion";

const INPUT_SELECTORS = [
  "#search-input",
  "input.search-input:not([aria-hidden='true'])",
  "input[type='search']",
  "input[placeholder*='搜索']",
  "input[placeholder*='search']",
  "input",
];

const LOGIN_MODAL_CLOSE_SELECTORS = [
  "button.close-icon",
  "xpath=//*[local-name()='svg' and contains(@class,'reds-icon') and .//*[local-name()='use' and (@xlink:href='#close' or @href='#close')]]/ancestor::button[1]",
  "xpath=//*[local-name()='use' and (@xlink:href='#close' or @href='#close')]/ancestor::button[1]",
  "xpath=//*[local-name()='svg' and contains(@class,'reds-icon') and .//*[local-name()='use' and (@xlink:href='#close' or @href='#close')]]",
];

const LOGIN_MODAL_PRESENCE_SELECTORS = [
  "i.reds-mask[aria-label='弹窗遮罩']",
  ...LOGIN_MODAL_CLOSE_SELECTORS,
];

const INTENT_RULES = [
  ["费用预算", /费用|多少钱|预算|学费|生活费|花费|便宜|性价比|成本/u],
  ["申请条件", /申请|条件|要求|材料|时间线|流程|GPA|gpa|雅思|托福|语言|绩点|背景/u],
  ["院校选择", /学校|大学|院校|排名|国立|南洋|管理大学|科廷|詹姆斯库克|kaplan|psb|sim|jcu/u],
  ["专业方向", /专业|商科|计算机|护理|幼教|教育|传媒|金融|会计|工程|数据|心理|酒店/u],
  ["升学阶段", /本科|硕士|研究生|博士|高中|初中|小学|低龄|AEIS|aeis|O水准|A水准|国际学校/u],
  ["就业身份", /就业|工作|薪资|移民|绿卡|PR|pr|永居|回国|认可|留下/u],
  ["风险避坑", /避坑|后悔|中介|骗局|真实|缺点|劝退|水不水|值不值/u],
  ["生活准备", /租房|宿舍|生活|安全|银行卡|电话卡|行李|住宿/u],
];

function log(message) {
  console.log(`[xhs-keywords] ${message}`);
}

function parseArgs(argv) {
  const options = {
    industry: "",
    input: "",
    depth: 1,
    maxSeeds: 25,
    outDir: "output",
    headless: false,
    channel: "",
    executablePath: "",
    profileDir: "",
    slowMo: 80,
    timeoutMs: 18000,
    startupWaitMs: 0,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--industry" && next) {
      options.industry = next.trim();
      index += 1;
    } else if (arg === "--input" && next) {
      options.input = next;
      index += 1;
    } else if (arg === "--depth" && next) {
      options.depth = Math.max(1, Number.parseInt(next, 10) || 1);
      index += 1;
    } else if (arg === "--max-seeds" && next) {
      options.maxSeeds = Math.max(1, Number.parseInt(next, 10) || 25);
      index += 1;
    } else if (arg === "--out-dir" && next) {
      options.outDir = next;
      index += 1;
    } else if (arg === "--channel" && next) {
      options.channel = next;
      index += 1;
    } else if (arg === "--executable-path" && next) {
      options.executablePath = next;
      index += 1;
    } else if (arg === "--profile-dir" && next) {
      options.profileDir = next;
      index += 1;
    } else if (arg === "--slow-mo" && next) {
      options.slowMo = Math.max(0, Number.parseInt(next, 10) || 0);
      index += 1;
    } else if (arg === "--timeout-ms" && next) {
      options.timeoutMs = Math.max(3000, Number.parseInt(next, 10) || 18000);
      index += 1;
    } else if (arg === "--startup-wait-ms" && next) {
      options.startupWaitMs = Math.max(0, Number.parseInt(next, 10) || 0);
      index += 1;
    } else if (arg === "--headless") {
      options.headless = true;
    } else if (arg === "--headed") {
      options.headless = false;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

function usage() {
  return [
    "Usage:",
    "  npm.cmd run collect -- --industry 新加坡留学",
    "",
    "Options:",
    "  --industry <词>       行业母词",
    "  --input <file>        从文件读取种子词，一行一个",
    "  --depth <n>           扩展层数，默认 1",
    "  --max-seeds <n>       最多处理种子词数，默认 25",
    "  --out-dir <dir>       输出目录，默认 output",
    "  --headless            无头浏览器运行",
    "  --channel chrome      使用本机 Chrome 渠道",
    "  --executable-path <p> 使用指定浏览器路径",
    "  --profile-dir <dir>   使用独立浏览器资料目录，可首次手动登录后复用",
    "  --slow-mo <ms>        输入动作延迟，默认 80",
    "  --startup-wait-ms <n> 打开页面后等待一段时间，便于手动登录/验证",
  ].join("\n");
}

function normalizeLines(text) {
  return text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function loadInitialSeeds(options) {
  const seeds = [];

  if (options.industry) {
    seeds.push(options.industry);
  }

  if (options.input) {
    const text = await readFile(path.resolve(options.input), "utf8");
    seeds.push(...normalizeLines(text));
  }

  return [...new Set(seeds)];
}

function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "-",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function searchUrl(keyword) {
  return `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}`;
}

function absoluteXhsUrl(href) {
  if (!href) {
    return "";
  }

  try {
    return new URL(href, "https://www.xiaohongshu.com").toString();
  } catch {
    return href;
  }
}

function shouldCaptureRecommendResponse(url, keyword) {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.endsWith("xiaohongshu.com") &&
      parsed.pathname === "/api/sns/web/v1/search/recommend" &&
      parsed.searchParams.get("keyword") === keyword
    );
  } catch {
    return false;
  }
}

function extractSuggestions(payload) {
  return (payload?.data?.sug_items ?? [])
    .map((item) => item?.text?.trim())
    .filter(Boolean);
}

function inferIntent(keyword) {
  for (const [label, pattern] of INTENT_RULES) {
    if (pattern.test(keyword)) {
      return label;
    }
  }

  return "泛行业词";
}

function scoreRecord(record) {
  const sourceWeight = record.sources.length * 20;
  const depthWeight = Math.max(0, 12 - record.firstDepth * 4);
  const rankWeight = Math.max(0, 12 - record.bestRank);
  return sourceWeight + depthWeight + rankWeight;
}

function escapeCsvCell(value) {
  const text = String(value ?? "");
  if (!/[",\n]/u.test(text)) {
    return text;
  }

  return `"${text.replace(/"/gu, '""')}"`;
}

async function closeLoginModal(page) {
  const isVisible = async () => {
    for (const selector of LOGIN_MODAL_PRESENCE_SELECTORS) {
      try {
        if (await page.locator(selector).first().isVisible({ timeout: 250 })) {
          return true;
        }
      } catch {
        // Try the next selector.
      }
    }
    return false;
  };

  if (!(await isVisible())) {
    return false;
  }

  for (const selector of LOGIN_MODAL_CLOSE_SELECTORS) {
    const locator = page.locator(selector).first();
    try {
      if (await locator.isVisible({ timeout: 500 })) {
        await locator.click({ timeout: 2000, force: true });
        await page.waitForTimeout(300);
        if (!(await isVisible())) {
          return true;
        }
      }
    } catch {
      // Try the next selector.
    }
  }

  return false;
}

async function findSearchInput(page) {
  const currentUrl = page.url();
  const bodyText = await page.locator("body").innerText({ timeout: 3000 }).catch(() => "");

  if (currentUrl.includes("/website-login/error") || bodyText.includes("IP存在风险")) {
    throw new Error("小红书平台返回 IP 风险页，请切换可靠网络，或使用 --channel chrome --headed 在本机 Chrome 中重试");
  }

  for (const selector of INPUT_SELECTORS) {
    const locator = page.locator(selector).first();
    try {
      await locator.waitFor({ state: "visible", timeout: 3500 });
      const metadata = await locator.evaluate((node) => ({
        id: node.id || "",
        className: String(node.className || ""),
        type: node.getAttribute("type") || "",
        placeholder: node.getAttribute("placeholder") || "",
        ariaHidden: node.getAttribute("aria-hidden") || "",
      }));

      const haystack = `${metadata.id} ${metadata.className} ${metadata.type} ${metadata.placeholder}`;
      const looksLikeSearch =
        /search|搜索/u.test(haystack) &&
        metadata.ariaHidden !== "true" &&
        !/phone|mobile|tel|验证码|code/u.test(haystack);

      if (!looksLikeSearch && selector === "input") {
        continue;
      }

      return locator;
    } catch {
      // Try the next selector.
    }
  }

  const latestUrl = page.url();
  const latestText = await page.locator("body").innerText({ timeout: 3000 }).catch(() => "");
  if (latestUrl.includes("/website-login/error") || latestText.includes("IP存在风险")) {
    throw new Error("小红书平台返回 IP 风险页，请切换可靠网络，或使用 --channel chrome --headed 在本机 Chrome 中重试");
  }

  throw new Error(`未找到可见的小红书搜索输入框；当前页面：${latestUrl}`);
}

async function clearInput(locator) {
  await locator.evaluate((node) => {
    node.focus();
    node.value = "";
    node.dispatchEvent(new Event("input", { bubbles: true }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function collectSuggestionsForSeed(page, input, seed, options) {
  await closeLoginModal(page);
  await clearInput(input);

  const responsePromise = page.waitForResponse(
    (response) => response.ok() && shouldCaptureRecommendResponse(response.url(), seed),
    { timeout: options.timeoutMs }
  );

  await input.focus();
  await input.type(seed, { delay: options.slowMo });
  await page.waitForTimeout(500);

  const response = await responsePromise;
  const payload = await response.json();

  return {
    responseUrl: response.url(),
    suggestions: [...new Set(extractSuggestions(payload))],
  };
}

function addSuggestions(records, run, suggestions) {
  suggestions.forEach((suggestion, index) => {
    const rank = index + 1;
    const existing = records.get(suggestion);

    if (existing) {
      existing.bestRank = Math.min(existing.bestRank, rank);
      existing.sources.push({
        sourceSeed: run.seed,
        rank,
        depth: run.depth,
        responseUrl: run.responseUrl,
        capturedAt: run.capturedAt,
      });
      return;
    }

    records.set(suggestion, {
      keyword: suggestion,
      intent: inferIntent(suggestion),
      firstSourceSeed: run.seed,
      firstDepth: run.depth,
      bestRank: rank,
      sourceType: SOURCE_TYPE,
      platform: "xiaohongshu",
      evidenceUrl: searchUrl(run.seed),
      capturedAt: run.capturedAt,
      sources: [
        {
          sourceSeed: run.seed,
          rank,
          depth: run.depth,
          responseUrl: run.responseUrl,
          capturedAt: run.capturedAt,
        },
      ],
    });
  });
}

function addSearchPageKeywords(records, run, keywords, sourceLabel) {
  keywords.forEach((keyword, index) => {
    const value = keyword.trim();
    if (!value || value.length < 2) {
      return;
    }

    const rank = index + 1;
    const existing = records.get(value);
    const source = {
      sourceSeed: run.seed,
      rank,
      depth: run.depth,
      responseUrl: run.evidenceUrl,
      capturedAt: run.capturedAt,
      sourceLabel,
    };

    if (existing) {
      existing.bestRank = Math.min(existing.bestRank, rank);
      existing.sources.push(source);
      return;
    }

    records.set(value, {
      keyword: value,
      intent: inferIntent(value),
      firstSourceSeed: run.seed,
      firstDepth: run.depth,
      bestRank: rank,
      sourceType: "xiaohongshu_search_result_page",
      platform: "xiaohongshu",
      evidenceUrl: run.evidenceUrl,
      capturedAt: run.capturedAt,
      sources: [source],
    });
  });
}

function addTitleDerivedKeywords(records, run, notes) {
  const candidates = new Map();
  const patterns = [
    /新加坡留学(一年多少钱|费用|中介|申请|本科|硕士|生活|劝退|规划|vlog|日常|必带|必看|艺术生|体检|宿舍|真实感受|性价比)?/giu,
    /新加坡(本科|硕士|大学|私立大学|公立学校|国立|南洋|留学生|生活|高消费|陪读妈妈|低龄留学|申请条件)/giu,
    /(留学中介|一年多少钱|申请条件|家境普通|性价比|劝退|骗局|陪读妈妈|低龄留学|国际本科|私立大学|公立学校)/gu,
  ];

  for (const note of notes) {
    for (const pattern of patterns) {
      for (const match of note.title.matchAll(pattern)) {
        const value = match[0].replace(/[：:、,，.!！?？"“”'‘’()[\]【】]/gu, "").trim();
        if (value.length >= 3 && value.length <= 18 && !candidates.has(value)) {
          candidates.set(value, note);
        }
      }
    }
  }

  for (const [keyword, note] of candidates) {
    const existing = records.get(keyword);
    const source = {
      sourceSeed: run.seed,
      rank: note.rank,
      depth: run.depth,
      responseUrl: note.url,
      capturedAt: run.capturedAt,
      sourceLabel: "前排笔记标题",
      noteTitle: note.title,
      noteUrl: note.url,
    };

    if (existing) {
      existing.bestRank = Math.min(existing.bestRank, note.rank);
      existing.sources.push(source);
      continue;
    }

    records.set(keyword, {
      keyword,
      intent: inferIntent(keyword),
      firstSourceSeed: run.seed,
      firstDepth: run.depth,
      bestRank: note.rank,
      sourceType: "xiaohongshu_note_title",
      platform: "xiaohongshu",
      evidenceUrl: note.url,
      capturedAt: run.capturedAt,
      sources: [source],
    });
  }
}

function extractSearchPageRelatedTerms(bodyText, seed) {
  const lines = bodyText
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  const terms = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index] === "大家都在搜") {
      for (const term of lines.slice(index + 1, index + 5)) {
        if (term && term.length <= 30) {
          terms.push(term);
        }
      }
    }
  }

  const sortIndex = lines.indexOf("综合");
  if (sortIndex >= 0) {
    for (const term of lines.slice(sortIndex + 1, sortIndex + 16)) {
      if (term.length <= 12 && !/^\d|^\d{2}-\d{2}|^\d{4}-\d{2}-\d{2}/u.test(term)) {
        terms.push(term.includes(seed) ? term : `${seed}${term}`);
      }
    }
  }

  return [...new Set(terms)].filter((term) => !["图文", "视频", "用户", "筛选"].includes(term));
}

async function collectSearchPageForSeed(page, seed, options) {
  await page.goto(searchUrl(seed), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(Math.min(5000, Math.max(1200, options.slowMo * 20)));

  const bodyText = await page.locator("body").innerText({ timeout: 5000 });
  const notes = await page
    .locator('a.title[href*="/search_result/"]')
    .evaluateAll((nodes) =>
      nodes
        .map((node, index) => ({
          rank: index + 1,
          title: (node.innerText || node.textContent || "").trim(),
          href: node.getAttribute("href") || "",
        }))
        .filter((item) => item.title)
    );

  return {
    relatedTerms: extractSearchPageRelatedTerms(bodyText, seed),
    notes: notes.map((note) => ({
      ...note,
      url: absoluteXhsUrl(note.href),
    })),
  };
}

function buildFinalRecords(records) {
  return [...records.values()]
    .map((record) => ({
      ...record,
      score: scoreRecord(record),
      evidenceSummary:
        record.sourceType === "xiaohongshu_search_suggestion"
          ? `来自小红书搜索框联想词；由种子词「${record.firstSourceSeed}」触发，至少 ${record.sources.length} 个来源命中。`
          : record.sourceType === "xiaohongshu_note_title"
            ? `来自小红书搜索结果前排笔记标题；由种子词「${record.firstSourceSeed}」触发，至少 ${record.sources.length} 篇笔记命中。`
            : `来自小红书搜索结果页相关搜索/筛选词；由种子词「${record.firstSourceSeed}」触发，至少 ${record.sources.length} 个来源命中。`,
    }))
    .sort((left, right) => right.score - left.score || left.keyword.localeCompare(right.keyword, "zh-Hans-CN"));
}

function buildCsv(records) {
  const headers = [
    "keyword",
    "intent",
    "score",
    "sourceType",
    "firstSourceSeed",
    "sourceCount",
    "bestRank",
    "firstDepth",
    "evidenceUrl",
    "capturedAt",
    "evidenceSummary",
  ];

  const lines = [headers.join(",")];
  for (const record of records) {
    lines.push(
      [
        record.keyword,
        record.intent,
        record.score,
        record.sourceType,
        record.firstSourceSeed,
        record.sources.length,
        record.bestRank,
        record.firstDepth,
        record.evidenceUrl,
        record.capturedAt,
        record.evidenceSummary,
      ]
        .map(escapeCsvCell)
        .join(",")
    );
  }

  return `\uFEFF${lines.join("\n")}\n`;
}

function buildMarkdown(industry, records, runs, options) {
  const groups = new Map();
  for (const record of records) {
    if (!groups.has(record.intent)) {
      groups.set(record.intent, []);
    }
    groups.get(record.intent).push(record);
  }

  const lines = [
    `# 小红书行业关键词地图：${industry}`,
    "",
    `- 采集来源：小红书搜索框联想词`,
    `- 采集种子数：${runs.length}`,
    `- 关键词数：${records.length}`,
    `- 扩展层数：${options.depth}`,
    `- 生成时间：${new Date().toISOString()}`,
    "",
    "## Top 关键词",
    "",
    "| 排名 | 关键词 | 意图 | 分数 | 来源种子 | 依据 |",
    "|---:|---|---|---:|---|---|",
  ];

  records.slice(0, 30).forEach((record, index) => {
    lines.push(
      `| ${index + 1} | ${record.keyword} | ${record.intent} | ${record.score} | ${record.firstSourceSeed} | ${record.evidenceSummary} |`
    );
  });

  lines.push("", "## 按用户意图分组", "");

  for (const [intent, items] of groups) {
    lines.push(`### ${intent}`, "");
    lines.push("| 关键词 | 分数 | 来源种子 | 搜索页 |");
    lines.push("|---|---:|---|---|");
    for (const record of items.slice(0, 40)) {
      lines.push(
        `| ${record.keyword} | ${record.score} | ${record.firstSourceSeed} | ${record.evidenceUrl} |`
      );
    }
    lines.push("");
  }

  lines.push("## 已处理种子", "");
  lines.push("| 种子词 | 层级 | 状态 | 联想词数量 |");
  lines.push("|---|---:|---|---:|");
  for (const run of runs) {
    lines.push(`| ${run.seed} | ${run.depth} | ${run.status} | ${run.suggestions.length} |`);
  }

  return `${lines.join("\n")}\n`;
}

async function saveOutputs(options, industry, records, runs) {
  const timestamp = formatTimestamp(new Date());
  const baseName = `xhs-keywords-${industry.replace(/[\\/:*?"<>|\s]+/gu, "-")}-${timestamp}`;
  const outDir = path.resolve(options.outDir);
  await mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, `${baseName}.json`);
  const csvPath = path.join(outDir, `${baseName}.csv`);
  const mdPath = path.join(outDir, `${baseName}.md`);

  await writeFile(
    jsonPath,
    `${JSON.stringify({ industry, options, runs, keywords: records }, null, 2)}\n`,
    "utf8"
  );
  await writeFile(csvPath, buildCsv(records), "utf8");
  await writeFile(mdPath, `\uFEFF${buildMarkdown(industry, records, runs, options)}`, "utf8");

  return { jsonPath, csvPath, mdPath };
}

async function run(options) {
  if (options.help) {
    console.log(usage());
    return;
  }

  const chromium = await loadChromium();

  const initialSeeds = await loadInitialSeeds(options);
  if (initialSeeds.length === 0) {
    throw new Error("请提供 --industry 或 --input");
  }

  const industry = options.industry || initialSeeds[0];
  const queue = initialSeeds.map((seed) => ({ seed, depth: 1 }));
  const visitedSeeds = new Set();
  const records = new Map();
  const runs = [];

  const launchOptions = {
    headless: options.headless,
    slowMo: options.slowMo,
    ...(options.channel ? { channel: options.channel } : {}),
    ...(options.executablePath ? { executablePath: options.executablePath } : {}),
  };

  const contextOptions = {
    viewport: { width: 1440, height: 900 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
  };

  let browser = null;
  let context = null;

  if (options.profileDir) {
    context = await chromium.launchPersistentContext(path.resolve(options.profileDir), {
      ...launchOptions,
      ...contextOptions,
    });
  } else {
    browser = await chromium.launch(launchOptions);
    context = await browser.newContext(contextOptions);
  }

  const page = await context.newPage();

  try {
    log(`打开小红书页面：${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

    if (options.startupWaitMs > 0) {
      log(`等待 ${options.startupWaitMs}ms，期间可手动登录或完成验证`);
      await page.waitForTimeout(options.startupWaitMs);
    }

    await closeLoginModal(page);

    let input = null;
    let useSearchPageFallback = false;

    try {
      input = await findSearchInput(page);
    } catch (error) {
      useSearchPageFallback = true;
      log(`未找到搜索框，切换到搜索结果页证据模式：${error.message}`);
    }

    while (queue.length > 0 && visitedSeeds.size < options.maxSeeds) {
      const item = queue.shift();
      if (!item || visitedSeeds.has(item.seed) || item.depth > options.depth) {
        continue;
      }

      visitedSeeds.add(item.seed);
      log(`采集种子词(${visitedSeeds.size}/${options.maxSeeds})：${item.seed}`);

      const runRecord = {
        seed: item.seed,
        depth: item.depth,
        status: "failed",
        sourceType: SOURCE_TYPE,
        evidenceUrl: searchUrl(item.seed),
        responseUrl: "",
        capturedAt: new Date().toISOString(),
        suggestions: [],
        error: "",
      };

      try {
        if (useSearchPageFallback || !input) {
          const result = await collectSearchPageForSeed(page, item.seed, options);
          runRecord.status = "success";
          runRecord.sourceType = "xiaohongshu_search_result_page";
          runRecord.responseUrl = page.url();
          runRecord.suggestions = result.relatedTerms;
          runRecord.notes = result.notes;
          addSearchPageKeywords(records, runRecord, result.relatedTerms, "大家都在搜/搜索筛选词");
          addTitleDerivedKeywords(records, runRecord, result.notes);

          if (item.depth < options.depth) {
            for (const suggestion of result.relatedTerms) {
              if (!visitedSeeds.has(suggestion) && queue.length + visitedSeeds.size < options.maxSeeds) {
                queue.push({ seed: suggestion, depth: item.depth + 1 });
              }
            }
          }

          log(`成功：${item.seed} -> ${result.relatedTerms.length} 个相关搜索词，${result.notes.length} 篇前排笔记`);
        } else {
          const result = await collectSuggestionsForSeed(page, input, item.seed, options);
          runRecord.status = "success";
          runRecord.responseUrl = result.responseUrl;
          runRecord.suggestions = result.suggestions;
          addSuggestions(records, runRecord, result.suggestions);

          if (item.depth < options.depth) {
            for (const suggestion of result.suggestions) {
              if (!visitedSeeds.has(suggestion) && queue.length + visitedSeeds.size < options.maxSeeds) {
                queue.push({ seed: suggestion, depth: item.depth + 1 });
              }
            }
          }

          log(`成功：${item.seed} -> ${result.suggestions.length} 个联想词`);
        }
      } catch (error) {
        runRecord.error = error.message;
        log(`失败：${item.seed} -> ${error.message}`);
      }

      runs.push(runRecord);
      await page.waitForTimeout(700);
    }
  } finally {
    await context.close();
    if (browser) {
      await browser.close();
    }
  }

  const finalRecords = buildFinalRecords(records);
  const outputPaths = await saveOutputs(options, industry, finalRecords, runs);

  log(`完成：${finalRecords.length} 个关键词`);
  log(`JSON：${outputPaths.jsonPath}`);
  log(`CSV：${outputPaths.csvPath}`);
  log(`Markdown：${outputPaths.mdPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const options = parseArgs(process.argv.slice(2));
  run(options).catch((error) => {
    console.error(`[xhs-keywords] 任务失败：${error.message}`);
    process.exitCode = 1;
  });
}

export {
  buildCsv,
  buildFinalRecords,
  buildMarkdown,
  extractSuggestions,
  inferIntent,
  parseArgs,
  shouldCaptureRecommendResponse,
};
