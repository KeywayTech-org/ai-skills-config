---
name: skillhub-install
description: 从 SkillHub (skillhub.cn) 按 slug 安装 Agent Skill 到本地目录。当用户说「装一下 skillhub 上的 xxx」「从 skillhub 安装某 skill」「把 skillhub.cn 的某技能拉到本地」时使用。适用于 WorkBuddy 推荐市场（BuiltinMarket）里没有、但 SkillHub 社区市场有的技能。
license: MIT
metadata:
  type: command
  runtime: "python3"
  version: "1.0.0"
  requires:
    bins:
      - "python3"
      - "curl"
  env: []
---

# SkillHub 技能安装器

按 slug 从 SkillHub 拉取技能的全部文件并安装到本地目录。

## 适用场景
- WorkBuddy 推荐市场搜不到、但 skillhub.cn 上有的技能（如小红书/抖音/SEO/内容创作类社区技能）。
- 需要把一个社区 skill 的 SKILL.md 及其 references/scripts/src 等资源完整落地到指定目录。

## 关键接口（已验证）
- 列表/详情元数据：`GET https://api.skillhub.cn/api/v1/skills/{slug}`（只给元数据，**不含文件内容**）
- 文件清单：`GET https://api.skillhub.cn/api/v1/skills/{slug}/files` → `{"count":N,"version":"x.y.z","files":[{"path":"SKILL.md","sha256":"...","size":123}]}`
- 文件内容：`GET https://api.skillhub.cn/api/v1/skills/{slug}/file?path={path}` → **302 重定向**到 `https://skillhub-1388575217.cos.accelerate.myqcloud.com/skills/{id}/{slug}/{version}/files/{path}`（直接用 urllib/带 -L 的 curl 跟随重定向即可拿到正文）
- 注意：SkillHub 详情接口部分 slug 会返回空 `skill` 字段，文件清单以 `/files` 为准。

## 安装脚本
保存为 `install_skillhub.py` 并运行（需要真实网络，沙箱内 COS 域名常被拦，按需加 `dangerouslyDisableSandbox`）：

```python
import urllib.request, json, os, urllib.parse, sys

API = "https://api.skillhub.cn/api/v1/skills"
TARGET = sys.argv[1] if len(sys.argv) > 1 else r"."
slugs = sys.argv[2:] or []

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "SkillHub-Daily/5.0", "Referer": "https://skillhub.cn/"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()

for slug in slugs:
    files = json.loads(fetch(f"{API}/{slug}/files"))
    for f in files.get("files", []):
        p = f["path"]
        data = fetch(f"{API}/{slug}/file?path={urllib.parse.quote(p, safe='')}")
        d = os.path.join(TARGET, slug, p)
        os.makedirs(os.path.dirname(d), exist_ok=True)
        open(d, "wb").write(data)
        print("saved", slug, p, len(data))
```

用法：
```bash
python3 install_skillhub.py "D:/Taozhuowei/projects/skills/work" xhs-content-research xiaohongshu-content-tools
```

## 安装后让 WorkBuddy 可用
- 镜像一份到用户级技能目录 `C:/Users/87659/.workbuddy/skills/{slug}/`（或项目级 `{workspace}/.workbuddy/skills/`）。
- 当前会话的 Skill 列表在启动时固定，新装技能需**重载会话**才会出现在 Skill 工具列表；但可立即读取其 `SKILL.md` 按指令执行。
- 注意：SkillHub 社区技能常依赖第三方付费数据 API（如 `SOCIALDATAX_API_KEY`、`GUAIKEI_API_TOKEN`），无 Key 时只能套用其方法论处理用户自带数据。

## 安全
- 安装前建议先看一眼 SKILL.md 与 scripts，确认无高危操作（读浏览器数据、登录、发帖、删除等）。本安装器只下载文件，不执行任何脚本。
