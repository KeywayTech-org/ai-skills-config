[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$RemoteCommand
)

$keyPath = Join-Path $HOME '.ssh\promptdesign_ed25519'
if (-not (Test-Path -LiteralPath $keyPath)) {
    throw "PromptDesign SSH key is missing: $keyPath"
}

$sshArguments = @(
    '-i', $keyPath,
    '-o', 'IdentitiesOnly=yes',
    '-o', 'BatchMode=yes',
    '-o', 'ConnectTimeout=15',
    'ubuntu@82.156.178.154'
)

if ($RemoteCommand.Count -gt 0) {
    $sshArguments += $RemoteCommand
}

& ssh @sshArguments
exit $LASTEXITCODE
