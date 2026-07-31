# Brand Strategy Skill — Windows 一键安装脚本
Write-Host "🎯 正在安装 Brand Strategy Skill..." -ForegroundColor Cyan
$SkillDir = "$env:USERPROFILE\.claude\skills\brand-strategy"
New-Item -ItemType Directory -Force -Path $SkillDir | Out-Null
try {
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/liuyang00100010-star/mini-jack-repo/main/skill/SKILL.md" -OutFile "$SkillDir\SKILL.md"
    Write-Host "✅ 安装完成！" -ForegroundColor Green
    Write-Host "📁 位置: $SkillDir\SKILL.md"
    Write-Host "🚀 重启 Claude Code 后使用: /brand-strategy [品牌名]" -ForegroundColor Yellow
} catch {
    Write-Host "❌ 安装失败: $_" -ForegroundColor Red
}
