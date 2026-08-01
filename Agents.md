# Agents 使用说明

## 1. 这个目录的作用

本仓库是 **KeywayTech AI Skills** 的统一集合，用于沉淀可在多种 AI Agent / IDE 之间复用的中文 skills。

- 每个 skill 是一个独立目录，目录内必须包含 `SKILL.md`。
- skills 平铺在仓库根目录下，不再区分旧的 `code/`、`work/`、`find-skills/` 层级。
- 目录中的 `scripts/` 提供 PowerShell 脚本，用于更新 skills 源仓库并将 skills 部署到本机 Agent。

## 2. 脚本的作用与使用时机

### 2.1 `scripts/update-skills.ps1`

**作用**：拉取本仓库（`ai-skills`）及所有内部 skills 源仓库的最新提交，并自动将 `ai-skills` 中的 skills 复制部署到本机 Agent。

**使用时机**：当用户说“更新 skills”、“拉取最新 skills”或“同步 skills 仓库”时执行。

**标准执行流程**：

1. 检测 `ai-skills` 的 git 工作区，判断是否有 skill 被删除（见 [2.3 删除同步标准流程](#23-删除同步标准流程)）。
2. 输出将要更新的源仓库清单，等待用户确认。
3. 依次执行 `git pull` / `git clone`。
4. 自动调用 `scripts/deploy-skills.ps1 -Yes` 进行复制部署。

**用法**：

```powershell
# 标准用法：更新 + 自动复制部署
.\scripts\update-skills.ps1

# 跳过所有确认提示
.\scripts\update-skills.ps1 -Yes

# 只更新仓库，不自动部署
.\scripts\update-skills.ps1 -NoDeploy
```

**配置内部源仓库**：编辑 `scripts/skills-sources.json`，按以下格式添加仓库：

```json
{
  "name": "repo-name",
  "url": "https://github.com/Keyway-Tech/repo-name.git",
  "localPath": "../repo-name",
  "description": "描述"
}
```

> **注意**：`update-skills.ps1` 会按 `localPath` 将内部源仓库克隆为仓库的同级目录（如 `../easy-naming`），仅用于统一拉取/同步，不会自动合并到 `ai-skills`。若希望部署内部源仓库中的 skill，请将其目录复制到本仓库根目录后再运行更新脚本。

### 2.2 `scripts/deploy-skills.ps1`

**作用**：自动探测本机已安装的 AI Agent，并将 `ai-skills` 仓库中的 skills 平铺部署到各 Agent 的 skills 目录。

**使用时机**：当用户说“部署 skills”、“把 skills 装到 Agent”、“让 Claude/Cursor/Trae 用上这些 skills”时执行。

**标准执行流程**：

1. 检测 `ai-skills` 的 git 工作区，判断是否有 skill 被删除（见 [2.3 删除同步标准流程](#23-删除同步标准流程)）。
2. 输出探测到的目标 Agent/目录清单。
3. 输出待部署 skill 清单，等待用户确认。
4. 执行复制部署。
5. 如有已确认的删除，从所有 Agent skills 目录同步删除这些 skill。

**用法**：

```powershell
# 默认使用复制方式部署
.\scripts\deploy-skills.ps1

# 预演模式：查看将要执行的操作，不写入文件
.\scripts\deploy-skills.ps1 -DryRun

# 强制覆盖同名但内容不同的 skill
.\scripts\deploy-skills.ps1 -Force

# 使用目录联接（Windows）/ 符号链接（Unix）替代复制
.\scripts\deploy-skills.ps1 -Link

# 跳过确认提示
.\scripts\deploy-skills.ps1 -Yes
```

**行为**：

- 读取 `scripts/agent-targets.json` 中的 Agent 目录配置。
- 通过探测各 Agent 的配置目录判断其是否已安装。
- 将本仓库根目录下所有包含 `SKILL.md` 的目录**复制**到目标 skills 目录。
- 仅覆盖与 `ai-skills` 中同名的 skill，**不会影响 Agent skills 目录中的其他 skill**。
- 通过 `SKILL.md` 内容哈希判断同名 skill 是否一致：一致则跳过，不一致则默认跳过并提示，可使用 `-Force` 强制覆盖。
- 兜底扫描用户主目录下所有 `*/skills` 目录，兼容未列出的 Agent。

### 2.3 删除同步标准流程

无论是用户手动删除，还是 Agent 在操作过程中删除了 `ai-skills` 目录内的某个 skill，`update-skills.ps1` 和 `deploy-skills.ps1` 在执行前都会按以下标准流程处理：

1. **检测 git 工作区变动**
   - 脚本通过 `git status --porcelain` 检测被删除的顶层 skill 目录。
   - 判定条件：该目录在 `HEAD` 中存在 `SKILL.md`，但在当前工作区已不存在。

2. **向用户确认删除意图**
   - 脚本输出被删除的 skill 列表，并提供三个选项：
     - **恢复**：视为误删，执行 `git restore <skill-dir>` 恢复，并终止本次操作。
     - **同步删除**：确认删除，并继续执行更新/部署；部署完成后，从所有本机 Agent 的 skills 目录中删除这些 skill。
     - **取消**：终止本次操作，不写入任何文件。

3. **同步删除的范围限制**
   - 只删除 `ai-skills` 中已确认删除的那些 skill 名称。
   - **不会**删除 Agent skills 目录中的其他 skill。

4. **非交互模式**
   - 使用 `-Yes` 时，脚本默认将检测到的删除视为“同步删除”，不再弹窗询问。
   - 使用 `-NoDeploy` 时，仅更新仓库，不执行部署和同步删除。

## 3. 如何部署到 Agent 里

### 3.1 一键更新并部署

在仓库根目录执行：

```powershell
.\scripts\update-skills.ps1
```

此命令会先确认更新清单，拉取所有源仓库，然后**自动复制部署**到本机 Agent。

若只想部署、不更新：

```powershell
.\scripts\deploy-skills.ps1
```

然后重启对应 Agent / IDE，使其重新读取 skills。

### 3.2 常见 Agent skills 目录对照表

| Agent | 默认 skills 目录 | 状态 | 备注 |
|---|---|---|---|
| Claude Code | `~/.claude/skills` | 已验证 | Skills 标准制定者 |
| OpenAI Codex CLI | `~/.codex/skills` | 已验证 | 可在 `~/.codex/config.toml` 中自定义 `skills.directory` |
| Cursor | `~/.cursor/skills` | 已验证 | 几乎无缝兼容 Claude Skills |
| OpenCode | `~/.opencode/skills` 或 `~/.config/opencode/skills` | 已验证 | 项目级可放在 `.opencode/skills` |
| Trae / Trae-CN | `~/.trae/skills` 或 `~/.trae-cn/skills` | 未验证 | 部分版本可能仅支持 IDE 内技能市场导入 |
| Gemini CLI | `~/.gemini/skills` | 未验证 | 实验性支持；Workspace 级放在 `.gemini/skills` |
| Kimi Code | `~/.kimi/skills` | 未验证 | 实验性 Skills 支持，目录待官方确认 |
| Qwen Code | `~/.qwen/skills` | 未验证 | Qwen Code v0.6.0+ 实验性 Skills 支持 |
| Windsurf (Codeium) | `~/.windsurf/rules` | 未验证 | Windsurf 使用 AI Rules / Memories，非标准 Skills 格式 |
| VS Code + GitHub Copilot | 无文件目录 | 不支持 | 通过 VS Code settings 配置 Agent Skills |
| Aider | 无文件目录 | 不支持 | 不采用 SKILL.md 格式的 skills 机制 |

> `~` 表示用户主目录。Windows 下通常为 `C:\Users\<用户名>`。

### 3.3 添加新的 Agent 目录

若需要支持新的 Agent，编辑 `scripts/agent-targets.json`，按以下格式追加：

```json
{
  "name": "agent-id",
  "displayName": "Agent 显示名称",
  "detectDirs": ["~/.agent"],
  "targetDirs": ["~/.agent/skills"],
  "verified": false,
  "source": "文档链接",
  "notes": "说明"
}
```

## 4. 故障排查

### 4.1 未检测到任何 Agent

- 请先安装目标 Agent / IDE。
- 或手动创建其 skills 目录（如 `mkdir ~/.claude/skills`）后再运行部署脚本。
- 检查 `scripts/agent-targets.json` 中的目录配置是否与实际安装路径一致。

### 4.2 同名 skill 冲突

脚本默认不会覆盖内容不同的 skill。处理方式：

- 手动比较后删除/重命名旧目录，再重新运行部署脚本；或
- 使用 `.\scripts\deploy-skills.ps1 -Force` 强制覆盖。

### 4.3 Windows 无法创建联接

- 以有权限的账户运行 PowerShell。
- 脚本默认使用复制方式部署，无需创建联接。若仍希望使用联接，可传入 `-Link`。

### 4.4 某个 Agent 没有生效

- 确认已重启该 Agent / IDE。
- 确认该 Agent 版本支持 Skills 机制。
- 对于未验证的 Agent，其目录可能随官方更新而变化，请参考对应官方文档调整 `scripts/agent-targets.json`。

## 5. 维护建议

- 定期运行 `scripts/update-skills.ps1` 同步内部源仓库。
- 新增或修改 skill 后，运行 `scripts/deploy-skills.ps1` 同步到本机 Agent。
- 保持 `scripts/skills-sources.json` 和 `scripts/agent-targets.json` 与实际情况同步。
