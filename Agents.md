# KeywayTech AI Skills

## 仓库职责

本仓库只维护 skill 索引和 Agent 操作说明，不保存 skill 源文件，也不提供部署脚本。

- `skills-index.json` 是唯一索引文件。
- `skills` 记录 skill 名称和 GitHub 地址。
- `agents` 记录 Agent 的检测目录和 skills 目录。
- `README.md` 和源仓库中的 `README.md` 只作为说明文档，不替代索引。

## 部署流程

用户要求安装、部署、同步或更新 skills 时，严格按以下顺序执行。

### 1. 读取索引

先读取 `skills-index.json`，校验以下内容：

- JSON 可以正常解析。
- skill 名称不重复；已确认来源的 GitHub 地址不为空，`unresolved` skill 不参与自动安装或同步。
- Agent 映射包含检测目录和至少一个 skills 目录。

不得根据记忆、目录名称或搜索结果自行补充未列入索引的 skill。

### 2. 检测本机 Agent

遍历索引中的 `agents`：

1. 展开 `~` 为当前用户目录。
2. 检查 `detectDirs`，只将实际安装的 Agent 纳入本次操作。
3. 对已安装 Agent 使用其 `skillsDirs` 作为部署目标。
4. 不要因为目标目录不存在就判定 Agent 未安装；如果 `detectDirs` 存在但 skills 目录不存在，可以创建该 Agent 的 skills 目录。

未列入索引的 Agent 不纳入本次操作；不要扫描并修改任意未知目录。

### 3. 首次安装 skill

对每个索引 skill，在每个已检测到的 Agent skills 目录中检查目标 skill 是否存在。

目标目录通常为：

```text
<agent-skills-dir>/<skill-name>
```

首次安装必须先读取该 skill GitHub 仓库根目录的 `README.md`：

1. 如果 README 明确指定安装方式，严格使用 README 指定的方式。
2. 如果 README 没有提及安装方式，使用 `git clone <github> <agent-skills-dir>/<skill-name>`。
3. 如果 README 的安装方式与索引名称或目标目录不一致，暂停该 skill，报告冲突，不得猜测参数或改装到其他目录。
4. 安装完成后检查目标目录和 `SKILL.md` 是否存在。

不得把 GitHub 地址直接当作已安装成功的证据，也不得跳过 README 检查。

### 4. 已安装 skill 的更新判断

对已存在的 skill：

1. 读取其来源仓库 README，确认仓库规定的更新方式。
2. 获取 GitHub 仓库的最新状态。
3. 将本地 skill 与远程最新版本比较，比较范围包括 `SKILL.md`、脚本、references、assets 和其他受版本控制的文件。
4. 已经是最新版本时跳过，不覆盖本地文件。
5. 不是最新版本时使用 README 指定的更新方式；README 未指定时，在临时目录获取最新仓库，验证成功后更新目标目录。
6. 更新失败或来源不明确时保留原版本并报告，不删除原目录。

不得仅比较 `SKILL.md`，也不得用 `git pull` 更新一个不是 Git 仓库的复制目录。

### 5. 结果汇报

完成后按 Agent 和 skill 汇报：

- 新安装
- 已更新
- 已是最新并跳过
- 未检测到的 Agent
- README 缺失或安装方式冲突
- 下载、权限或校验失败

索引中没有的本地 skill 默认保留，不主动删除。删除或清理操作必须获得用户明确授权。

## 安全边界

- 不提交、输出或记录访问令牌、密码和其他凭据。
- 使用 GitHub 私有仓库时复用本机已有 Git 凭据，不要求把凭据写入文件或命令参数。
- 首次安装和更新前先展示将操作的 Agent、skill、来源地址和目标目录；除非用户明确要求自动执行，否则等待确认。
- 不覆盖不同来源的同名 skill；发现冲突时停止并报告。
- 不修改 `skills-index.json`，除非用户明确要求变更索引。

## 验证

修改索引或文档后执行：

```powershell
$index = Get-Content skills-index.json -Raw -Encoding UTF8 | ConvertFrom-Json
$index.skills.Count
$index.agents.Count
```

同时确认仓库根目录下没有 skill 源目录，且不存在 `scripts` 目录。
