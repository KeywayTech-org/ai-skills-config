#!/bin/bash
# Brand Strategy Skill — 一键安装脚本
echo "🎯 正在安装 Brand Strategy Skill..."
SKILL_DIR="$HOME/.claude/skills/brand-strategy"
mkdir -p "$SKILL_DIR"
curl -sL "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -o "$SKILL_DIR/SKILL.md"
if [ $? -eq 0 ]; then
    echo "✅ 安装完成！"
    echo "📁 位置: $SKILL_DIR/SKILL.md"
    echo "🚀 重启 Claude Code 后使用: /brand-strategy [品牌名]"
else
    echo "❌ 安装失败，请检查网络连接"
fi
