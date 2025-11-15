Param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ComposeArgs
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir "..")
$StackDir = Join-Path $RootDir "infra/graphiti-mcp"

Set-Location $StackDir
Write-Host "[graphiti] Starting Graphiti MCP stack via docker compose..."
docker compose up -d @ComposeArgs
Write-Host "[graphiti] Stack is starting in the background. MCP endpoint: http://localhost:8000/mcp/"
Set-Location $RootDir
