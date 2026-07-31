小柳总品牌商业咨询skill v1.8
一个开箱即用的专业级AI品牌顾问。给它一个品牌名，它会主动联网调研，从品牌诊断到战略建议，15-20分钟生成简洁美观的专业级品牌战略咨询报告（HTML，一键转 PDF）。
产出报告的质量：定性分析的深度和框架感上接近专业咨询水平，定量分析、财务建模、执行可衡量性三个维度较上一版本有明显提升。
写作风格	⭐⭐⭐⭐⭐	偏向说人话、而非很多咨询公司的八股文。
三大子agent并行，内置24个分析框架，涵盖市场与品牌、产品与定价、战略与增长、创意与内容、其他思维模型和分析模型等五大维度。

**Claude Code 品牌战略咨询 Skill**
> 24个分析框架 × AI驱动 × 对标McKinsey/BCG/Kotler/Bain
> 输入一个品牌名 → 15分钟生成专业级品牌战略咨询报告

<br>

<a href="https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/install.sh">
  <img src="https://img.shields.io/badge/⚡_一键安装_Skill-blue?style=for-the-badge&logo=claude&logoColor=white" alt="一键安装">
</a>
<a href="https://github.com/liuyang00100010-star/mini-jack-repo/blob/main/skill/SKILL.md">
  <img src="https://img.shields.io/badge/📖_查看_Skill_文件-green?style=for-the-badge" alt="查看Skill文件">
</a>
<a href="https://github.com/liuyang00100010-star/mini-jack-repo/blob/main/docs/brand-analysis-guide.md">
  <img src="https://img.shields.io/badge/📊_方法论文档-orange?style=for-the-badge" alt="方法论文档">
</a>

---

## ⚡ 一键安装

### 方式一：复制命令安装（推荐）

<details>
<summary><b>🍎 macOS / Linux</b> — 点击展开复制命令</summary>

```bash
mkdir -p ~/.claude/skills/brand-strategy && curl -sL https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md -o ~/.claude/skills/brand-strategy/SKILL.md && echo "✅ 安装完成！重启 Claude Code 后使用"
```

</details>

<details>
<summary><b>🪟 Windows PowerShell</b> — 点击展开复制命令</summary>

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\skills\brand-strategy" | Out-Null; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile "$env:USERPROFILE\.claude\skills\brand-strategy\SKILL.md"; Write-Host "✅ 安装完成！重启 Claude Code 后使用"
```

</details>

### 方式二：手动安装

1. 下载 [SKILL.md](skill/SKILL.md) 文件
2. 复制到你的 Claude Code skills 目录：
   - **macOS / Linux**: `~/.claude/skills/brand-strategy/SKILL.md`
   - **Windows**: `%USERPROFILE%\.claude\skills\brand-strategy\SKILL.md`
3. 重启 Claude Code

### 方式三：一键脚本

<a href="https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/install.sh">
  <img src="https://img.shields.io/badge/🍎_macOS/Linux_一键安装-点击下载-blue?style=for-the-badge" alt="macOS/Linux 一键安装">
</a>

<a href="https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/install.ps1">
  <img src="https://img.shields.io/badge/🪟_Windows_一键安装-点击下载-green?style=for-the-badge" alt="Windows 一键安装">
</a>

下载后右键用终端运行即可。

---

### 其他 AI 编程工具安装

本 Skill 兼容所有支持自定义指令 / Rules 的 AI 编程工具。下载同一个 [SKILL.md](skill/SKILL.md)，放到对应目录即可。

<details>
<summary><b>🟣 Cursor</b> — 项目级 Rules</summary>

1. 在项目根目录创建 `.cursor/rules/` 文件夹
2. 将 `SKILL.md` 复制为 `.cursor/rules/brand-strategy.md`
3. 打开 Cursor，在对话中输入 `/brand-strategy Nike` 即可触发

```bash
# macOS / Linux
mkdir -p .cursor/rules && curl -sL https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md -o .cursor/rules/brand-strategy.md
```

```powershell
# Windows PowerShell
New-Item -ItemType Directory -Force -Path ".cursor\rules" | Out-Null; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile ".cursor\rules\brand-strategy.md"
```

> 💡 也可用全局 Rules：`~/.cursor/rules/brand-strategy.md`，所有项目通用。

</details>

<details>
<summary><b>🔵 Windsurf (Codeium)</b> — Cascade Rules</summary>

1. 在项目根目录创建 `.windsurf/rules/` 文件夹
2. 将 `SKILL.md` 复制为 `.windsurf/rules/brand-strategy.md`
3. 在 Cascade 对话中引用即可

```bash
# macOS / Linux
mkdir -p .windsurf/rules && curl -sL https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md -o .windsurf/rules/brand-strategy.md
```

```powershell
# Windows PowerShell
New-Item -ItemType Directory -Force -Path ".windsurf\rules" | Out-Null; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile ".windsurf\rules\brand-strategy.md"
```

> 💡 也可放在全局 `~/.windsurf/rules/` 目录下。

</details>

<details>
<summary><b>🟢 GitHub Copilot</b> — Custom Instructions</summary>

1. 在项目根目录创建 `.github/` 文件夹
2. 将 `SKILL.md` 复制为 `.github/copilot-instructions.md`
3. Copilot Chat 会自动加载该文件作为上下文

```bash
# macOS / Linux
mkdir -p .github && curl -sL https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md -o .github/copilot-instructions.md
```

```powershell
# Windows PowerShell
New-Item -ItemType Directory -Force -Path ".github" | Out-Null; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile ".github\copilot-instructions.md"
```

> ⚠️ Copilot Chat 会自动读取该文件，无需手动触发。但功能完整度取决于 Copilot 的工具调用能力。

</details>

<details>
<summary><b>🟠 OpenAI Codex CLI</b> — Instructions</summary>

1. 在项目根目录创建 `.codex/` 文件夹
2. 将 `SKILL.md` 复制为 `.codex/instructions.md`
3. 在 Codex CLI 中直接提问即可

```bash
# macOS / Linux
mkdir -p .codex && curl -sL https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md -o .codex/instructions.md
```

```powershell
# Windows PowerShell
New-Item -ItemType Directory -Force -Path ".codex" | Out-Null; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile ".codex\instructions.md"
```

</details>

<details>
<summary><b>🟤 Cline</b> — Rules 文件</summary>

1. 在项目根目录创建 `.clinerules/` 文件夹
2. 将 `SKILL.md` 复制为 `.clinerules/brand-strategy.md`
3. 在 Cline 对话中引用该规则文件

```bash
# macOS / Linux
mkdir -p .clinerules && curl -sL https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md -o .clinerules/brand-strategy.md
```

```powershell
# Windows PowerShell
New-Item -ItemType Directory -Force -Path ".clinerules" | Out-Null; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile ".clinerules\brand-strategy.md"
```

</details>

<details>
<summary><b>⚪ Aider</b> — Conventions 文件</summary>

1. 将 `SKILL.md` 重命名为 `.aider-conventions.md` 放在项目根目录
2. Aider 启动时会自动加载该文件作为上下文

```bash
# macOS / Linux
curl -sL https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md -o .aider-conventions.md
```

```powershell
# Windows PowerShell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile ".aider-conventions.md"
```

> ⚠️ Aider 的工具调用能力有限，报告生成质量可能不如 Claude Code / Cursor。

</details>

<details>
<summary><b>🟣 WorkBuddy</b> — Skills 目录</summary>

1. 将 `SKILL.md` 复制到 `~/.workbuddy/skills/brand-strategy/SKILL.md`
2. 重启 WorkBuddy

```bash
# macOS / Linux
mkdir -p ~/.workbuddy/skills/brand-strategy && curl -sL https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md -o ~/.workbuddy/skills/brand-strategy/SKILL.md
```

```powershell
# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.workbuddy\skills\brand-strategy" | Out-Null; Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile "$env:USERPROFILE\.workbuddy\skills\brand-strategy\SKILL.md"
```

</details>

## 🚀 使用方法

安装后重启 Claude Code，然后输入：

```
/brand-strategy Nike
/brand-strategy https://www.starbucks.com
/brand-strategy 海底捞
```

Skill 会自动完成：信息搜索 → 框架分析 → HTML报告生成。

## ✨ 核心能力

| 维度 | 覆盖内容 |
|------|----------|
| **战略分析** | STP定位、SWOT、波特五力、安索夫矩阵、BCG矩阵 |
| **品牌资产** | Keller CBBE模型、品牌健康度计分卡、品牌架构分析 |
| **消费者洞察** | 消费者旅程地图、决策路径、触点情绪曲线 |
| **竞争情报** | 竞争格局扫描、标杆对比、竞品反应模拟（博弈论/Nash均衡） |
| **增长落地** | TAM/SAM/SOM市场规模、财务影响估算、KPI框架（30/60/90天） |
| **商业模式** | 商业模式画布、定价策略、品牌延伸 |

## 📊 报告结构

```
封面 → 执行摘要（金字塔原理）→ 品牌识别 → 竞争分析 → 消费者洞察
→ 战略选择 → 品牌定位 → 品牌资产评估 → 品牌架构 → 商业模式与定价
→ 增长路径 → 实施路线图 → 风险评估 → 附录
```

每份报告包含：
- **执行摘要**：McKinsey风格金字塔原理，结论先行
- **数据支撑**：所有论点有来源标注
- **可执行建议**：含时间线、负责人、预算框架
- **风险对冲**：保守/基准/乐观三种情景 + 止损线



## 📖 方法论文档

- [品牌分析方法论] 24个框架详解 + 7步分析流程
- [Skill完整定义](skill/SKILL.md) — AI可执行的完整指令集（1042行）

## 🔧 环境要求

- **AI 编程工具**：Claude Code（推荐）、Cursor、Windsurf、GitHub Copilot、OpenAI Codex CLI、Cline、Aider、WorkBuddy 等
- **Node.js**（HTML渲染用）
- **Python** `httpx` + `beautifulsoup4`（信息抓取，可选）

## 📁 仓库结构

```
├── skill/
│   └── SKILL.md                     # ← 核心Skill文件（安装这个）
├── brand-analysis-guide.md          # 方法论文档
├── CLAUDE.md                        # 项目配置
└── README.md                        # 本文件
```

## 🧠 设计理念

> 不是"给一个框架让AI填空"，而是模拟顶级咨询公司的分析师思维链：
> 识别隐藏前提 → 选择分析框架 → 展示推理过程 → 输出可执行建议

**对标：**
- **McKinsey** — 金字塔原理、假设驱动分析
- **BCG** — 增长矩阵、竞争动态
- **Kotler** — STP定位、品牌资产理论
- **Bain** — NPS/CSAT、客户旅程、3C三角

---

## License

MIT


它能帮你：看清品牌定位与心智占位；诊断核心问题；在竞品格局里找到属于你的差异化方向；发现被领先市场验证、本地尚未发生的增长机会。
核心能力：
主动搜索，不靠编造：财报、行业研报、用户口碑三层信源交叉验证。
22 个经典框架按需调用（定位理论、品牌资产模型、波特五力、安索夫矩阵等），展示分析路径而非只给结论。
机会优先于问题：不只修 bug，更指一条明路。
交付即排版：封面、页眉页脚、分析框、数据高亮齐备。
适合品牌方战略复盘、咨询/广告从业者出方案初稿、创业者验证方向、投资人快速扫标的。

## 🚀 使用方式

### Claude Code
```bash
/brand-strategy [品牌名]
```

### Cursor / Windsurf / Cline
在对话中引用 Rules 文件，或直接描述品牌分析需求。

### GitHub Copilot / Codex / Aider
直接在 Chat 中描述品牌分析需求，系统会自动加载已安装的 Skill 上下文。

输入示例："/brand-strategy Nike 瑞幸" / 直接粘贴官网链接。
