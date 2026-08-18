# KeywayTech AI Skills Config

面向多种 AI Agent 和 IDE 的 skill 来源索引。

## 索引

根目录的 [`skills-index.json`](skills-index.json) 是唯一配置文件：

- `skills` 记录 skill 名称和真实 GitHub 源仓库地址。
- `agents` 记录 Agent 检测目录和部署目录。
- 未确认公开来源的 skill 会标记为 `unresolved`，不会被自动安装或同步。

## 同步约定

自动同步程序应先读取并校验 `skills-index.json`，只处理实际安装的 Agent，并按每个 skill 的真实来源仓库获取内容。来源仓库的 README、分支和 skill 路径必须在安装或更新前核实；同步失败时保留已有版本，不删除未列入索引的本地 skill。

## 仓库职责

本仓库只维护索引和 Agent 操作说明，不保存 skill 源文件，也不提供 skill 源目录。skill 的源代码由索引中的 GitHub 仓库维护。
