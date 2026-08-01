# KeywayTech AI Skills

面向多种 AI Agent 和 IDE 的中文 skills 集合。

本仓库 skills 平铺在根目录下，每个 skill 是一个包含 `SKILL.md` 的独立目录。

## 快速使用

- **更新并部署 skills**：运行 [`scripts/update-skills.ps1`](scripts/update-skills.ps1)，拉取本仓库及配置的内部源仓库最新提交，然后**自动复制部署**到本机已安装的 Agent。
- **仅部署到 Agent**：运行 [`scripts/deploy-skills.ps1`](scripts/deploy-skills.ps1)，将本仓库 skills **复制**到本机已安装的 Agent skills 目录（仅覆盖同名 skill，不影响其他 skill）。

详细说明见 [`Agents.md`](Agents.md)。

## 目录结构

```text
<skill-name>/   单个 skill 目录，必须包含 SKILL.md
scripts/        PowerShell 脚本：更新、部署
Agents.md       给 Agent 的使用说明
README.md       本文件
```

## Skills 中文说明

### 开发与工程

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

### 工作与业务

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

运行 `scripts/deploy-skills.ps1` 前，请先安装目标 Agent/IDE，或手动创建其 skills 目录。常见路径见 `Agents.md`。

### 出现同名冲突

部署脚本默认不会覆盖已有的不同版本 skill。请人工比较冲突目录，确认后删除或改名旧目录，再重新运行部署脚本。

### 删除 skill 后如何同步

删除 `ai-skills` 仓库根目录下的 skill 目录后，运行 `scripts/update-skills.ps1` 或 `scripts/deploy-skills.ps1` 时会检测 git 工作区变动，并询问是恢复误删还是同步删除到所有 Agent。选择“同步删除”即可从本机所有 Agent skills 目录中移除该 skill。

## 维护

- 使用 `scripts/update-skills.ps1` 拉取本仓库及内部源仓库的最新提交。
- 修改后提交并推送即可分发新的 npm 包版本。
