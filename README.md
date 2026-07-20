# KeywayTech AI Skills

面向多种 AI Agent 和 IDE 的中文 skills 集合与一键安装器。

本仓库包含开发类 skills（`code/`）、工作交付类 skills（`work/`）及通用 skills（`find-skills/`）。

## 一键安装

安装 Node.js 18 或更高版本后，运行：

```bash
npx -y --package=@keywaytech/ai-skills ai-skills
```

只查看将执行的操作：

```bash
npx -y --package=@keywaytech/ai-skills ai-skills --dry-run
```

## 安装器行为

安装器会：

- 自动识别 Codex、Claude Code、Trae、Gemini、Kimi、Qwen、Cursor、Windsurf 等已安装工具；也会扫描用户主目录下已有的 `*/skills` 目录。
- 将本包内容同步到稳定的本机管理目录：`~/.keywaytech/ai-skills`。
- 为每个已识别工具的 skills 目录创建目录联接，不依赖临时 npx 缓存。
- 通过 `SKILL.md` 内容哈希去重：内容一致时跳过；同名但内容不同则不覆盖，并输出中文错误说明。
- 在权限不足、包内容缺失、目标冲突或未识别工具时输出中文自然语言错误。

首次安装后，请重启对应 Agent 或 IDE，使其重新读取 skills。

## 目录结构

```text
code/          开发、测试、Git、前端与工程流程 skills
work/          品牌、营销、文档、内容与设计交付 skills
find-skills/   通用 skill 发现工具
bin/           npx 安装器
```

## Skills 中文说明

### 开发与工程（`code/`）

| Skill | 用途 |
| --- | --- |
| `0xdarkmatter-structural-search` | 使用 AST 进行结构化代码搜索与安全模式检索。 |
| `89jobrien-security-engineering` | 进行应用安全架构、威胁建模与漏洞治理。 |
| `addyosmani-code-review-and-quality` | 从正确性、性能、可维护性等维度审查代码。 |
| `agentspace-so-find-skills` | 搜索、筛选和安装适合任务的 Agent skill。 |
| `autumnsgrove-git-advanced` | 处理高级 Git 工作流、变基、冲突和恢复。 |
| `c0ntr0lledcha0s-analyzing-patterns` | 识别代码模式、重复结构和设计问题。 |
| `c0ntr0lledcha0s-analyzing-test-quality` | 评估测试覆盖、断言质量和测试风险。 |
| `davila7-senior-architect` | 进行软件架构设计、技术选型和系统拆分。 |
| `davila7-senior-devops` | 设计 CI/CD、部署、基础设施与运维流程。 |
| `emilkowalski-apple-design` | 以 Apple 风格完善界面、动效与组件细节。 |
| `mattpocock-improve-codebase-architecture` | 识别并推进代码库架构改进。 |
| `mattpocock-to-prd` | 将讨论内容整理为可执行的产品需求文档。 |
| `pbakaus-impeccable` | 深度优化 Web 界面的视觉、交互和可访问性。 |
| `sickn33-bash-scripting` | 编写和审查可靠的 Bash 自动化脚本。 |
| `sickn33-stride-analysis-patterns` | 使用 STRIDE 方法进行安全威胁分析。 |
| `sickn33-webapp-testing` | 使用浏览器自动化测试本地 Web 应用。 |
| `softaworks-naming-analyzer` | 改进变量、函数、类和模块命名。 |
| `supercent-io-performance-optimization` | 定位并优化应用性能瓶颈。 |
| `vercel-labs-vercel-react-best-practices` | 应用 React 与 Next.js 性能最佳实践。 |

### 工作与业务（`work/`）

| 功能组 | 包含 skill | 中文用途 |
| --- | --- | --- |
| 品牌策略 | `brand-*`、`competitor-branding`、`personal-brand`、`rebranding`、`target-audience` | 品牌定位、命名、视觉与语言规范、受众研究、竞品分析及品牌升级。 |
| 增长营销 | `aso`、`b2b-brand-marketing`、`d2c-marketing`、`email-marketing`、`google-ads`、`meta-ads`、`influencer-marketing`、`ugc-strategy`、`whatsapp-marketing` | 应用商店优化、广告投放、邮件营销、达人合作、用户内容与私域增长。 |
| 营销工具箱 | `marketingskills` | 包含 A/B 测试、SEO、内容、转化、定价、销售与营销分析等 47 个子 skill。 |
| 文档与演示 | `doc-coauthoring`、`technical-writer`、`guizang-ppt-skill` | 协作撰写文档、技术说明与网页演示文稿。 |
| 设计与媒体 | `canvas-design`、`pbakaus-arrange`、`pbakaus-typeset`、`theme-factory`、`hyperframes`、`hyperframes-media` | 制作静态视觉、优化排版与布局、生成主题、视频、字幕和配音素材。 |
| 内容生产 | `omi`、`seedance-ad-creative` | 生产小红书图文和短视频广告创意、分镜及提示词。 |

## 常见问题

### 未检测到工具

请先安装目标 Agent/IDE，或先创建其 skills 目录后重试。例如 Codex 使用 `~/.codex/skills`，Trae 使用 `~/.trae-cn/skills`。

### 出现同名冲突

安装器不会覆盖已有的不同版本。请人工比较冲突目录，确认后删除或改名旧目录，再重新运行安装命令。

### Windows 无法创建联接

请以有权限的账户运行终端；若系统策略限制创建目录联接，请启用开发者模式或联系管理员。

## 维护

本仓库作为统一 Git 仓库维护，不包含自动上游更新功能。修改后提交并推送即可分发新的 npm 包版本。
