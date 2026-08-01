#!/usr/bin/env pwsh
#Requires -Version 5.1
<#
.SYNOPSIS
    拉取本仓库及所有内部 skills 源仓库的最新提交。
.DESCRIPTION
    读取 scripts/skills-sources.json 中的仓库列表，对每个仓库执行 git pull；
    若本地尚未克隆，则自动 git clone。
    更新完成后会自动调用 scripts/deploy-skills.ps1，将 ai-skills 中的 skills 复制部署到本机 Agent。
    通常用于用户说“更新 skills”时执行。
    执行前会先输出将要更新的源仓库清单，等待用户确认。
.PARAMETER Yes
    跳过确认提示，直接执行更新与部署。
.PARAMETER NoDeploy
    更新完成后不自动触发部署脚本。
.PARAMETER Link
    传递给 deploy-skills.ps1，使用联接方式替代复制部署。
.EXAMPLE
    .\scripts\update-skills.ps1
.EXAMPLE
    .\scripts\update-skills.ps1 -Yes
.EXAMPLE
    .\scripts\update-skills.ps1 -NoDeploy
#>

param(
    [switch]$Yes,
    [switch]$NoDeploy,
    [switch]$Link
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$sourcesFile = Join-Path $scriptDir "skills-sources.json"
$homeDir = $HOME

function Write-Info { param([string]$Message) Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Success { param([string]$Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

if (-not (Test-Path $sourcesFile)) {
    Write-Error "未找到配置文件：$sourcesFile"
    exit 1
}

try {
    $config = Get-Content $sourcesFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-Error "解析 skills-sources.json 失败：$($_.Exception.Message)"
    exit 1
}

# 判断一个目录是否就是当前仓库（通过 remote url 匹配）
function Test-IsCurrentRepo {
    param([string]$Path)
    $gitDir = Join-Path $Path ".git"
    if (-not (Test-Path $gitDir)) { return $false }
    try {
        $remote = git -C $Path remote get-url origin 2>$null
        $currentRemote = git remote get-url origin 2>$null
        return $remote -and $currentRemote -and ($remote.Trim() -eq $currentRemote.Trim())
    } catch {
        return $false
    }
}

function Get-TargetDir {
    param([string]$LocalPath)
    if ([System.IO.Path]::IsPathRooted($LocalPath)) {
        return $LocalPath
    }
    return [System.IO.Path]::GetFullPath((Join-Path $repoRoot $LocalPath))
}

function Get-SourceAction {
    param($Source)
    $targetDir = Get-TargetDir -LocalPath $Source.localPath
    $action = if (Test-IsCurrentRepo $targetDir) {
        "git pull（当前仓库）"
    } elseif (Test-Path (Join-Path $targetDir ".git")) {
        "git pull"
    } elseif (Test-Path $targetDir) {
        "路径冲突（非 git 仓库）"
    } else {
        "git clone"
    }
    return [PSCustomObject]@{
        Name = $Source.name
        Description = $Source.description
        Url = $Source.url
        TargetDir = $targetDir
        Action = $action
    }
}

function Update-Source {
    param($Source, [string]$Action)
    $name = $Source.name
    $url = $Source.url
    $targetDir = Get-TargetDir -LocalPath $Source.localPath

    Write-Info "处理源仓库：$name ($($Source.description))"
    Write-Info "  路径：$targetDir"

    # 当前仓库：直接 pull
    if ($Action -eq "git pull（当前仓库）") {
        Write-Info "  检测到当前仓库，执行 git pull..."
        try {
            git -C $targetDir pull
            Write-Success "  $name 已更新到最新提交"
        } catch {
            Write-Error "  更新 $name 失败：$($_.Exception.Message)"
        }
        return
    }

    # 已存在：pull
    if ($Action -eq "git pull") {
        Write-Info "  本地已存在，执行 git pull..."
        try {
            git -C $targetDir pull
            Write-Success "  $name 已更新到最新提交"
        } catch {
            Write-Error "  更新 $name 失败：$($_.Exception.Message)"
        }
        return
    }

    # 路径冲突
    if ($Action -eq "路径冲突（非 git 仓库）") {
        Write-Error "  目标路径已存在但不是 git 仓库：$targetDir"
        return
    }

    # 不存在：clone
    $parentDir = Split-Path -Parent $targetDir
    if (-not (Test-Path $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
    }

    Write-Info "  本地不存在，执行 git clone..."
    try {
        git clone $url $targetDir
        Write-Success "  $name 克隆完成"
    } catch {
        Write-Error "  克隆 $name 失败：$($_.Exception.Message)"
    }
}

function Request-Confirmation {
    param([string]$Prompt)
    if ($Yes) { return $true }
    $response = Read-Host -Prompt "$Prompt [Y/n]"
    return ($response -eq "" -or $response -match "^[Yy]")
}

function Get-DeletedSkillDirsFromGit {
    $deletedSkills = @()
    $gitDir = Join-Path $repoRoot ".git"
    if (-not (Test-Path $gitDir)) { return $deletedSkills }

    $status = git -C $repoRoot status --porcelain 2>$null
    if (-not $status) { return $deletedSkills }

    $candidates = @{}
    foreach ($line in $status -split "`r?`n") {
        if ($line -match "^[A-Z? ]{2} (.+)$") {
            $filePath = $Matches[1]
            $topDir = ($filePath -split '[/\\]')[0]
            if ($topDir -and -not $candidates.ContainsKey($topDir)) {
                $candidates[$topDir] = $true
            }
        }
    }

    foreach ($dirName in $candidates.Keys) {
        $hasInHead = $false
        try {
            $null = git -C $repoRoot cat-file -e "HEAD:$dirName/SKILL.md" 2>$null
            $hasInHead = $true
        } catch {}
        $existsNow = Test-Path (Join-Path $repoRoot "$dirName\SKILL.md")
        if ($hasInHead -and -not $existsNow) {
            $deletedSkills += $dirName
        }
    }

    return $deletedSkills | Sort-Object -Unique
}

function Prompt-DeletedSkills {
    param([string[]]$DeletedSkills)
    Write-Host ""
    Write-Warn "检测到以下 skill 在 git 工作区中被删除："
    foreach ($name in $DeletedSkills) {
        Write-Host "  - $name"
    }

    if ($Yes) {
        return "sync"
    }

    $title = "删除同步确认"
    $message = "请选择如何处理这些被删除的 skill："
    $restore = New-Object System.Management.Automation.Host.ChoiceDescription "&恢复", "从 git 恢复这些 skill（视为误删）"
    $sync = New-Object System.Management.Automation.Host.ChoiceDescription "&同步删除", "确认删除，并从所有 Agent skills 目录同步删除"
    $cancel = New-Object System.Management.Automation.Host.ChoiceDescription "&取消", "取消本次操作"
    $options = [System.Management.Automation.Host.ChoiceDescription[]]($restore, $sync, $cancel)
    $result = $Host.UI.PromptForChoice($title, $message, $options, 2)

    switch ($result) {
        0 { return "restore" }
        1 { return "sync" }
        default { return "cancel" }
    }
}

function Restore-DeletedSkills {
    param([string[]]$DeletedSkills)
    foreach ($name in $DeletedSkills) {
        Write-Info "正在恢复：$name"
        try {
            git -C $repoRoot restore $name
            Write-Success "$name 已恢复"
        } catch {
            Write-Error "恢复 $name 失败：$($_.Exception.Message)"
        }
    }
}

Write-Info "开始扫描 skills 源仓库..."
Write-Info "当前仓库根目录：$repoRoot"

# 检测 git 中已删除的 skill
$skillsToDelete = @()
$deletedFromGit = Get-DeletedSkillDirsFromGit
if ($deletedFromGit.Count -gt 0) {
    $choice = Prompt-DeletedSkills -DeletedSkills $deletedFromGit
    switch ($choice) {
        "restore" {
            Restore-DeletedSkills -DeletedSkills $deletedFromGit
            Write-Info "已恢复误删的 skill，请重新运行脚本以继续更新。"
            exit 0
        }
        "sync" {
            $skillsToDelete = $deletedFromGit
        }
        default {
            Write-Warn "用户取消操作。"
            exit 0
        }
    }
}

$sourcePlans = @()
foreach ($source in $config.sources) {
    $sourcePlans += Get-SourceAction -Source $source
}

Write-Host ""
Write-Host "即将执行以下更新操作：" -ForegroundColor Cyan
Write-Host "----------------------------------------"
foreach ($plan in $sourcePlans) {
    $dirLabel = $plan.TargetDir -replace [regex]::Escape($homeDir), "~"
    Write-Host "- $($plan.Name) ($($plan.Description))"
    Write-Host "  动作：$($plan.Action)"
    Write-Host "  路径：$dirLabel"
    Write-Host ""
}
Write-Host "----------------------------------------"

if (-not (Request-Confirmation -Prompt "确认执行上述更新操作吗")) {
    Write-Warn "用户取消操作，未执行任何更新。"
    exit 0
}

Write-Host ""
foreach ($plan in $sourcePlans) {
    $source = $config.sources | Where-Object { $_.name -eq $plan.Name }
    Update-Source -Source $source -Action $plan.Action
    Write-Host ""
}

Write-Info "全部源仓库处理完毕。"

# 自动触发部署脚本
if (-not $NoDeploy) {
    Write-Host ""
    Write-Info "开始自动部署 skills 到本机 Agent..."
    $deployScript = Join-Path $scriptDir "deploy-skills.ps1"
    $deployArgs = @("-File", $deployScript, "-Yes")
    if ($Link) { $deployArgs += "-Link" }
    if ($skillsToDelete.Count -gt 0) { $deployArgs += "-DeletedSkills"; $deployArgs += ($skillsToDelete -join ",") }
    try {
        & powershell -ExecutionPolicy Bypass @deployArgs
        Write-Info "自动部署完成。"
    } catch {
        Write-Error "自动部署失败：$($_.Exception.Message)"
    }
} else {
    Write-Info "已指定 -NoDeploy，跳过自动部署。"
}
