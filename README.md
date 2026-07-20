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

## 常见问题

### 未检测到工具

请先安装目标 Agent/IDE，或先创建其 skills 目录后重试。例如 Codex 使用 `~/.codex/skills`，Trae 使用 `~/.trae-cn/skills`。

### 出现同名冲突

安装器不会覆盖已有的不同版本。请人工比较冲突目录，确认后删除或改名旧目录，再重新运行安装命令。

### Windows 无法创建联接

请以有权限的账户运行终端；若系统策略限制创建目录联接，请启用开发者模式或联系管理员。

## 维护

本仓库作为统一 Git 仓库维护，不包含自动上游更新功能。修改后提交并推送即可分发新的 npm 包版本。
