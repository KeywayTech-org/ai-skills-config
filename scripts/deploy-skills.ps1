#!/usr/bin/env pwsh
#Requires -Version 5.1
<#
.SYNOPSIS
    将 ai-skills 仓库中的 skills 平铺部署到本机已安装的 Agent skills 目录。
.DESCRIPTION
    读取 scripts/agent-targets.json，自动探测本机已安装的 Agent（Claude Code、Codex、Cursor、Trae 等），
    并将 ai-skills 根目录下所有包含 SKILL.md 的 skill 目录部署到对应 Agent 的 skills 目录。
    默认使用复制方式部署；后续执行 deploy-skills.ps1 会再次覆盖同名 skill，不会影响目录中的其他 skill。
    通常用于用户说“部署 skills”时执行。
.PARAMETER DryRun
    预演模式，仅显示将要执行的操作，不写入文件系统。
.PARAMETER Force
    遇到同名但内容不同的 skill 时强制覆盖。
.PARAMETER Link
    使用目录联接（Windows）或符号链接（Unix）替代复制。
.PARAMETER Yes
    跳过部署前的确认提示，直接执行部署。
.EXAMPLE
    .\scripts\deploy-skills.ps1
.EXAMPLE
    .\scripts\deploy-skills.ps1 -DryRun
.EXAMPLE
    .\scripts\deploy-skills.ps1 -Yes
#>

param(
    [switch]$DryRun,
    [switch]$Force,
    [switch]$Link,
    [switch]$Yes,
    [string[]]$DeletedSkills
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$targetsFile = Join-Path $scriptDir "agent-targets.json"

# 支持从命令行传入逗号分隔的删除列表
if ($DeletedSkills -and $DeletedSkills.Count -eq 1 -and $DeletedSkills[0].Contains(",")) {
    $DeletedSkills = $DeletedSkills[0] -split ","
}

function Write-Info { param([string]$Message) Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Success { param([string]$Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

if (-not (Test-Path $targetsFile)) {
    Write-Error "未找到配置文件：$targetsFile"
    exit 1
}

try {
    $config = Get-Content $targetsFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-Error "解析 agent-targets.json 失败：$($_.Exception.Message)"
    exit 1
}

$homeDir = $HOME
$isWindowsOS = $env:OS -eq "Windows_NT"

function Expand-HomePath {
    param([string]$Path)
    if ($Path -and $Path.StartsWith("~/")) {
        return Join-Path $homeDir $Path.Substring(2)
    }
    return $Path
}

function Get-SkillHash {
    param([string]$SkillDir)
    $manifest = Join-Path $SkillDir "SKILL.md"
    if (-not (Test-Path $manifest)) { return $null }
    if ($isWindowsOS) {
        $bytes = [System.IO.File]::ReadAllBytes($manifest)
        $sha = [System.Security.Cryptography.SHA256]::Create()
        $hash = $sha.ComputeHash($bytes)
        return ([BitConverter]::ToString($hash)).Replace("-", "")
    } else {
        return (Get-FileHash $manifest -Algorithm SHA256).Hash
    }
}

function Test-SameTarget {
    param([string]$LinkPath, [string]$TargetPath)
    try {
        if ($isWindowsOS) {
            $item = Get-Item $LinkPath -ErrorAction Stop
            if ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
                $realLink = $item.Target
                $realTarget = Resolve-Path $TargetPath
                return (Resolve-Path $realLink).Path -eq $realTarget.Path
            }
        } else {
            $realLink = (Get-Item $LinkPath).Target
            $realTarget = Resolve-Path $TargetPath
            return $realLink -eq $realTarget.Path
        }
    } catch {}
    return $false
}

function Find-SkillDirs {
    param([string]$Root)
    $skills = @()
    foreach ($dir in Get-ChildItem -Path $Root -Directory -Exclude @(".git", "scripts", "node_modules", ".github", ".vscode")) {
        if (Test-Path (Join-Path $dir.FullName "SKILL.md")) {
            $skills += $dir.FullName
        }
    }
    return $skills
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
        # 该目录在 HEAD 中存在 SKILL.md，但在工作区已不存在，则视为被删除的 skill
        $hasInHead = $false
        try {
            $null = git -C $repoRoot cat-file -e "HEAD:$dirName/SKILL.md" 2>$null
            if ($LASTEXITCODE -eq 0) {
                $hasInHead = $true
            }
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
        # 非交互模式：默认视为非误删，要求同步删除
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
        $path = Join-Path $repoRoot $name
        Write-Info "正在恢复：$name"
        try {
            git -C $repoRoot restore $name
            Write-Success "$name 已恢复"
        } catch {
            Write-Error "恢复 $name 失败：$($_.Exception.Message)"
        }
    }
}

function Remove-SkillsFromAgents {
    param(
        [string[]]$SkillNames,
        [array]$Agents
    )
    foreach ($agent in $Agents) {
        foreach ($targetDir in $agent.TargetDirs) {
            foreach ($name in $SkillNames) {
                $skillPath = Join-Path $targetDir $name
                if (Test-Path $skillPath) {
                    $label = $skillPath -replace [regex]::Escape($homeDir), "~"
                    if ($DryRun) {
                        Write-Info "  [预演] 将删除 $label"
                    } else {
                        try {
                            Remove-LinkOrDirectory $skillPath
                            Write-Success "  已从 $($agent.DisplayName) 删除 $name"
                        } catch {
                            Write-Error "  从 $($agent.DisplayName) 删除 $name 失败：$($_.Exception.Message)"
                        }
                    }
                }
            }
        }
    }
}

function Discover-Agents {
    $detected = @()
    foreach ($agent in $config.agents) {
        $foundDetectDir = $null
        foreach ($d in $agent.detectDirs) {
            $expanded = Expand-HomePath $d
            if (Test-Path $expanded) {
                $foundDetectDir = $expanded
                break
            }
        }
        if ($foundDetectDir) {
            $validTargetDirs = @()
            foreach ($t in $agent.targetDirs) {
                $expanded = Expand-HomePath $t
                if ($expanded) { $validTargetDirs += $expanded }
            }
            if ($validTargetDirs.Count -gt 0) {
                $detected += [PSCustomObject]@{
                    Name = $agent.name
                    DisplayName = $agent.displayName
                    TargetDirs = $validTargetDirs
                    Verified = $agent.verified
                    Notes = $agent.notes
                }
            }
        }
    }

    # 兜底扫描用户主目录下的 */skills
    if ($config.fallback.scanHomeForSkillsDirs) {
        $fallbackDirs = @()
        foreach ($dir in Get-ChildItem -Path $homeDir -Directory -Force -ErrorAction SilentlyContinue) {
            $skillsDir = Join-Path $dir.FullName "skills"
            if (Test-Path $skillsDir) {
                # 避免重复添加已知 Agent
                $alreadyKnown = $false
                $normalizedFallback = [System.IO.Path]::GetFullPath($skillsDir).TrimEnd('\', '/')
                foreach ($known in $detected) {
                    foreach ($knownDir in $known.TargetDirs) {
                        $normalizedKnown = [System.IO.Path]::GetFullPath($knownDir).TrimEnd('\', '/')
                        if ($normalizedFallback -eq $normalizedKnown) {
                            $alreadyKnown = $true
                            break
                        }
                    }
                    if ($alreadyKnown) { break }
                }
                if (-not $alreadyKnown) {
                    $fallbackDirs += $skillsDir
                }
            }
        }
        if ($fallbackDirs.Count -gt 0) {
            $detected += [PSCustomObject]@{
                Name = "fallback"
                DisplayName = "未知 Agent（兜底扫描）"
                TargetDirs = $fallbackDirs
                Verified = $false
                Notes = "通过扫描用户主目录下的 */skills 目录发现。"
            }
        }
    }

    return $detected
}

function Request-Confirmation {
    param([string]$Prompt)
    if ($Yes -or $DryRun) { return $true }
    $response = Read-Host -Prompt "$Prompt [Y/n]"
    return ($response -eq "" -or $response -match "^[Yy]")
}

function Remove-LinkOrDirectory {
    param([string]$Path)
    $item = Get-Item $Path -ErrorAction SilentlyContinue
    if (-not $item) { return }
    if ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        Remove-Item $Path -Force
    } else {
        Remove-Item $Path -Recurse -Force
    }
}

function Deploy-Skill {
    param(
        [string]$SourceDir,
        [string]$TargetDir,
        [string]$AgentDisplayName
    )
    $skillName = Split-Path -Leaf $SourceDir
    $destination = Join-Path $TargetDir $skillName
    $label = $destination -replace [regex]::Escape($homeDir), "~"

    if (-not (Test-Path $TargetDir)) {
        if ($DryRun) {
            Write-Info "  [预演] 将创建目录 $label"
        } else {
            New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
        }
    }

    if (Test-Path $destination) {
        $sameContent = (Get-SkillHash $destination) -eq (Get-SkillHash $SourceDir)
        $sameLink = $Link -and (Test-SameTarget $destination $SourceDir)
        if ($sameContent -or $sameLink) {
            Write-Success "  $skillName 已存在且内容一致，跳过"
            return
        }
        if ($Force) {
            if ($DryRun) {
                Write-Info "  [预演] 将强制覆盖 $label"
            } else {
                Remove-LinkOrDirectory $destination
            }
        } else {
            Write-Warn "  $skillName 已存在且内容不同，未覆盖（使用 -Force 强制覆盖）"
            return
        }
    }

    if ($DryRun) {
        if (-not $Link) {
            Write-Info "  [预演] 将复制 $skillName 到 $label"
        } else {
            Write-Info "  [预演] 将创建联接 $skillName -> $label"
        }
        return
    }

    try {
        if (-not $Link) {
            Copy-Item -Path $SourceDir -Destination $destination -Recurse -Force
            Write-Success "  $skillName 已复制"
        } else {
            if ($isWindowsOS) {
                # Windows 目录联接不需要管理员权限（多数场景），且跨卷也可用
                cmd /c mklink /J "$destination" "$SourceDir" | Out-Null
            } else {
                New-Item -ItemType SymbolicLink -Path $destination -Target $SourceDir -Force | Out-Null
            }
            Write-Success "  $skillName 已联接"
        }
    } catch {
        Write-Error "  部署 $skillName 失败：$($_.Exception.Message)"
    }
}

$skillDirs = Find-SkillDirs -Root $repoRoot
if ($skillDirs.Count -eq 0) {
    Write-Warn "在 $repoRoot 下未找到任何包含 SKILL.md 的 skill 目录。"
    exit 0
}

$agents = Discover-Agents
if ($agents.Count -eq 0) {
    Write-Warn "未检测到已安装的 Agent 或 IDE skills 目录。"
    Write-Info "请安装 Claude Code、Codex、Cursor、Trae 等工具，或手动创建其 skills 目录后重试。"
    Write-Info "常见路径见 scripts/agent-targets.json 与 Agents.md。"
    exit 0
}

# 检测 git 中已删除的 skill
$skillsToDelete = @()
if ($DeletedSkills -and $DeletedSkills.Count -gt 0) {
    $skillsToDelete = $DeletedSkills
} else {
    $deletedFromGit = Get-DeletedSkillDirsFromGit
    if ($deletedFromGit.Count -gt 0) {
        $choice = Prompt-DeletedSkills -DeletedSkills $deletedFromGit
        switch ($choice) {
            "restore" {
                Restore-DeletedSkills -DeletedSkills $deletedFromGit
                Write-Info "已恢复误删的 skill，请重新运行脚本以继续部署。"
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
}

Write-Info "发现 $($skillDirs.Count) 个 skill，准备部署到 $($agents.Count) 个 Agent/目录。"
if ($DryRun) { Write-Warn "当前为预演模式，不会写入文件系统。" }
if (-not $Link) { Write-Info "使用复制模式部署。" } else { Write-Info "使用联接模式部署（Windows: junction；Unix: symlink）。" }

Write-Host ""
Write-Host "即将部署到以下目标目录：" -ForegroundColor Cyan
Write-Host "----------------------------------------"
foreach ($agent in $agents) {
    $verifiedText = if ($agent.Verified) { "已验证" } else { "未验证" }
    Write-Host "Agent：$($agent.DisplayName) [$verifiedText]"
    foreach ($targetDir in $agent.TargetDirs) {
        $label = $targetDir -replace [regex]::Escape($homeDir), "~"
        Write-Host "  - $label"
    }
}
Write-Host "----------------------------------------"

Write-Host ""
Write-Host "待部署 skill 清单：" -ForegroundColor Cyan
Write-Host "----------------------------------------"
foreach ($skillDir in $skillDirs) {
    Write-Host "  - $(Split-Path -Leaf $skillDir)"
}
Write-Host "----------------------------------------"

if (-not (Request-Confirmation -Prompt "确认将上述 $($skillDirs.Count) 个 skill 部署到 $($agents.Count) 个 Agent/目录吗")) {
    Write-Warn "用户取消操作，未执行任何部署。"
    exit 0
}

foreach ($agent in $agents) {
    Write-Host ""
    $verifiedText = if ($agent.Verified) { "已验证" } else { "未验证" }
    Write-Info "Agent：$($agent.DisplayName) [$verifiedText]"
    if ($agent.Notes) { Write-Info "备注：$($agent.Notes)" }
    foreach ($targetDir in $agent.TargetDirs) {
        Write-Info "目标目录：$($targetDir -replace [regex]::Escape($homeDir), "~")"
        foreach ($skillDir in $skillDirs) {
            Deploy-Skill -SourceDir $skillDir -TargetDir $targetDir -AgentDisplayName $agent.DisplayName
        }
    }
}

# 同步删除已确认的 skill
if ($skillsToDelete.Count -gt 0) {
    Write-Host ""
    Write-Warn "以下 skill 将从所有 Agent skills 目录同步删除："
    foreach ($name in $skillsToDelete) {
        Write-Host "  - $name"
    }
    Remove-SkillsFromAgents -SkillNames $skillsToDelete -Agents $agents
}

Write-Host ""
Write-Info "部署完成。请重启对应 Agent 或 IDE，使其重新读取 skills。"
