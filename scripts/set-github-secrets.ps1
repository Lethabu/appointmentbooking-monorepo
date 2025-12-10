<#
Set GitHub repository secrets from local .env files.

Usage (run locally):
  - Ensure GitHub CLI (`gh`) is installed and you're authenticated: `gh auth login`
  - Run this script from the repository root in PowerShell:
      pwsh ./scripts/set-github-secrets.ps1

What it does:
  - Reads `.env` files (looks in `apps/booking/.env`, `apps/dashboard/.env`, and root `.env`)
  - For each known secret name, if a value is found it sets the repository secret using `gh secret set`.

Security note: this script runs locally and uses `gh` to set secrets — secrets never leave your machine except to GitHub's API.
#>

Set-StrictMode -Version Latest

function Read-EnvFile($path) {
  $map = @{}
  if (-Not (Test-Path $path)) { return $map }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { return }
    if ($line -match '^(\w+)=(.*)$') {
      $k = $matches[1]
      $v = $matches[2]
      # remove surrounding quotes
      if ($v.StartsWith('"') -and $v.EndsWith('"')) { $v = $v.Substring(1, $v.Length-2) }
      if ($v.StartsWith("'") -and $v.EndsWith("'")) { $v = $v.Substring(1, $v.Length-2) }
      $map[$k] = $v
    }
  }
  return $map
}

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$candidates = @(
  Join-Path $repoRoot '.env',
  Join-Path $repoRoot 'apps\booking\.env',
  Join-Path $repoRoot 'apps\dashboard\.env'
)

$envMap = @{}
foreach ($p in $candidates) {
  $m = Read-EnvFile $p
  foreach ($k in $m.Keys) { if (-not $envMap.ContainsKey($k)) { $envMap[$k] = $m[$k] } }
}

$secretsToSet = @(
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_PROJECT_NAME',
  'VERCEL_TOKEN',
  'VERCEL_ORG_ID',
  'VERCEL_PROJECT_ID'
)

Write-Host "Found candidate env keys: $($envMap.Keys -join ', ')" -ForegroundColor Cyan

foreach ($name in $secretsToSet) {
  if ($envMap.ContainsKey($name) -and $envMap[$name]) {
    $val = $envMap[$name]
    Write-Host "Setting GitHub secret: $name" -ForegroundColor Green
    # Use gh CLI to set repo secret in current repository context
    $cmd = @('gh','secret','set',$name,'--body',$val)
    try {
      & $cmd
    } catch {
      Write-Warning "Failed to set secret $name via gh. Ensure gh is installed and you have repo admin rights. Error: $_"
    }
  } else {
    Write-Host "No value found for $name — skipping" -ForegroundColor Yellow
  }
}

Write-Host "Done. Verify secrets in GitHub repo Settings → Secrets → Actions." -ForegroundColor Cyan
