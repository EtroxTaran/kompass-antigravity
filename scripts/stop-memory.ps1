Param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ComposeArgs
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir "..")
$StackDir = Join-Path $RootDir "infra/graphiti-mcp"

Set-Location $StackDir
Write-Host "[graphiti] Stopping Graphiti MCP stack..."
docker compose down @ComposeArgs
Write-Host "[graphiti] Stack has been stopped."
Set-Location $RootDir
